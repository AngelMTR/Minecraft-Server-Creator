import express from "express";
import pkg from "pg";
import pm2 from "pm2";
import fs from "fs";
import path from "path";

async function logAction(action, serverName) {
    const logDir = path.resolve("./logs");
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

    const logFile = path.join(logDir, "server_actions.log");
    const logText = `[${new Date().toISOString()}] ${action} - ${serverName}\n`;
    fs.appendFileSync(logFile, logText);
}

const { Pool } = pkg;
const app = express();
app.use(express.json());

// اتصال به دیتابیس
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "javascriptinfo",
    password: "2001",
    port: 5432
});

// اتصال اولیه به PM2
function pm2Connect() {
    return new Promise((resolve, reject) => {
        pm2.connect(err => {
            if (err) reject(err);
            else resolve();
        });
    });
}

/* --------------------------
   API های مدیریت سرورها
-------------------------- */

// همه سرورها
app.get("/servers", async (req, res) => {
    const result = await pool.query("SELECT * FROM servers ORDER BY id ASC");
    res.json(result.rows);
});

// ساخت یک وب‌سرور جدید و ثبت در دیتابیس + اجرا با pm2
app.post("/servers", async (req, res) => {
    const { name, port } = req.body;

    if (!name || !port) {
        return res.status(400).json({ error: "Name and port are required" });
    }

    // اسکریپت ساده برای وب‌سرور (فایل جداگانه)
    const scriptPath = `./webservers/${name}.js`;

    // کد وب‌سرور رو تولید کنیم
    const serverCode = `
        import http from "http";
        const server = http.createServer((req, res) => {
            res.end("Hello from server ${name} on port ${port}");
        });
        server.listen(${port}, () => {
            console.log("Server ${name} running on port ${port}");
        });
    `;

    // فایل رو بسازیم
    const dir = path.resolve("./webservers");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, `${name}.js`), serverCode);

    try {
        // دیتابیس
        const result = await pool.query(
            "INSERT INTO servers (name, port, script, status) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, port, scriptPath, "running"]
        );

        // اجرای پروسه با pm2
        await pm2Connect();
        pm2.start(
            {
                script: scriptPath,
                name: name,
                interpreter: "node"
            },
            err => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json(result.rows[0]);
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// خاموش کردن سرور
app.post("/servers/:id/stop", async (req, res) => {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM servers WHERE id=$1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Server not found" });

    const server = result.rows[0];
    await pm2Connect();
    pm2.stop(server.name, async err => {
        if (err) return res.status(500).json({ error: err.message });

        await pool.query("UPDATE servers SET status=$1 WHERE id=$2", ["stopped", id]);
        res.json({ message: `Server ${server.name} stopped` });
    });
});

// روشن کردن سرور
app.post("/servers/:id/start", async (req, res) => {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM servers WHERE id=$1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Server not found" });

    const server = result.rows[0];
    await pm2Connect();
    pm2.start(
        {
            script: server.script,
            name: server.name,
            interpreter: "node"
        },
        async err => {
            if (err) return res.status(500).json({ error: err.message });

            await pool.query("UPDATE servers SET status=$1 WHERE id=$2", ["running", id]);
            res.json({ message: `Server ${server.name} started` });
        }
    );
});

// حذف کامل سرور
app.delete("/servers/:id", async (req, res) => {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM servers WHERE id=$1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Server not found" });

    const server = result.rows[0];
    await pm2Connect();
    pm2.delete(server.name, async err => {
        if (err) return res.status(500).json({ error: err.message });

        await pool.query("DELETE FROM servers WHERE id=$1", [id]);
        res.json({ message: `Server ${server.name} deleted` });
    });
});

// استعلام وضعیت از pm2
app.get("/servers/:id/status", async (req, res) => {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM servers WHERE id=$1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Server not found" });

    const server = result.rows[0];
    await pm2Connect();
    pm2.describe(server.name, (err, desc) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(desc);
    });
});

// خاموش کردن همه سرورها
app.post("/servers/stopAll", async (req, res) => {
    const result = await pool.query("SELECT * FROM servers");
    const servers = result.rows;
    await pm2Connect();

    for (let server of servers) {
        pm2.stop(server.name, async () => {
            await pool.query("UPDATE servers SET status=$1 WHERE id=$2", ["stopped", server.id]);
            await logAction("STOP", server.name);
        });
    }
    res.json({ message: "All servers stopped" });
});

// روشن کردن همه سرورها
app.post("/servers/startAll", async (req, res) => {
    const result = await pool.query("SELECT * FROM servers");
    const servers = result.rows;
    await pm2Connect();

    for (let server of servers) {
        pm2.start({ script: server.script, name: server.name, interpreter: "node" }, async () => {
            await pool.query("UPDATE servers SET status=$1 WHERE id=$2", ["running", server.id]);
            await logAction("START", server.name);
        });
    }
    res.json({ message: "All servers started" });
});

// ری‌استارت همه سرورها
app.post("/servers/restartAll", async (req, res) => {
    const result = await pool.query("SELECT * FROM servers");
    const servers = result.rows;
    await pm2Connect();

    for (let server of servers) {
        pm2.restart(server.name, async () => {
            await pool.query("UPDATE servers SET status=$1 WHERE id=$2", ["running", server.id]);
            await logAction("RESTART", server.name);
        });
    }
    res.json({ message: "All servers restarted" });
});


app.listen(7000, () => console.log("Server Manager running on port 7000"));
