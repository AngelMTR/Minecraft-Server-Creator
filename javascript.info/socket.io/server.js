// server.js  (ESM)
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import pg from "pg";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Pool } = pg;
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "javascriptinfo",
    password: "2001",
    port: 5432
});

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(express.static(join(__dirname, "public")));
app.use(express.json());

// --- Helpers ---
async function getProducts() {
    // اگر sort_order داری بر اساس اون، وگرنه بر اساس id
    const q = `
    SELECT id, size, color, brand, status, 
           COALESCE(sort_order, id) AS sort_order
    FROM products
    ORDER BY COALESCE(sort_order, id) ASC, id ASC
  `;
    const { rows } = await pool.query(q);
    return rows;
}

function emitProducts() {
    // پخش کامل لیست برای sync قطعی
    getProducts().then(list => io.emit("products", list)).catch(console.error);
}

// --- REST (اختیاری برای دیباگ/مصرف بیرونی) ---
app.get("/products", async (req, res) => {
    try {
        const list = await getProducts();
        res.json(list);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- Socket.IO ---
io.on("connection", async (socket) => {
    console.log("Client connected:", socket.id);

    // وقتی وصل شد، لیست فعلی رو بده
    try {
        const list = await getProducts();
        socket.emit("products", list);
    } catch (e) { console.error(e); }

    // افزودن محصول
    socket.on("addProduct", async ({ size, color, brand, status }) => {
        try {
            const insertQ = `
        INSERT INTO products (size, color, brand, status, sort_order)
        VALUES ($1,$2,$3,$4, COALESCE((SELECT MAX(sort_order) FROM products), 0) + 1)
        RETURNING *`;
            const { rows } = await pool.query(insertQ, [size, color, brand, status || "available"]);
            // میشه granular emit کرد، اما برای sync کامل لیست رو می‌فرستیم:
            emitProducts();
            io.emit("add", rows[0]); // اگر دوست داری رویداد جزئی هم داشته باش
        } catch (e) { console.error(e); }
    });

    // حذف محصول
    socket.on("deleteProduct", async ({ id }) => {
        try {
            await pool.query("DELETE FROM products WHERE id=$1", [id]);
            emitProducts();
            io.emit("delete", Number(id));
        } catch (e) { console.error(e); }
    });

    // تغییر وضعیت (toggle)
    socket.on("toggleStatus", async ({ id }) => {
        try {
            const { rows } = await pool.query(
                `UPDATE products
         SET status = CASE WHEN status='available' THEN 'unavailable' ELSE 'available' END
         WHERE id=$1
         RETURNING *`,
                [id]
            );
            emitProducts();
            io.emit("update", rows[0]);
        } catch (e) { console.error(e); }
    });

    // ویرایش اینلاین (size | color | brand | status)
    socket.on("updateProduct", async ({ id, field, value }) => {
        try {
            const allowed = ["size", "color", "brand", "status"];
            if (!allowed.includes(field)) return;

            const q = `UPDATE products SET ${field}=$1 WHERE id=$2 RETURNING *`;
            const { rows } = await pool.query(q, [value, id]);

            emitProducts();
            io.emit("update", rows[0]);
        } catch (e) { console.error(e); }
    });

    // جابجایی (Drag & Drop): آرایه‌ای از id ها به ترتیب جدید
    socket.on("reorderProducts", async ({ order }) => {
        // نیاز به ستون sort_order داریم (SQL پایین)
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            for (let i = 0; i < order.length; i++) {
                const id = Number(order[i]);
                await client.query("UPDATE products SET sort_order=$1 WHERE id=$2", [i + 1, id]);
            }
            await client.query("COMMIT");
            emitProducts(); // لیست جدید با ترتیب تازه
            io.emit("reorder", order);
        } catch (e) {
            await client.query("ROLLBACK");
            console.error(e);
        } finally {
            client.release();
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

httpServer.listen(5000, () => console.log("Server running on port 5000"));
