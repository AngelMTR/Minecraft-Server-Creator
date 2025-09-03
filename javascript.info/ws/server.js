import express from "express";
import pkg from "pg";
import { WebSocketServer } from "ws";
import http from "http";

const { Pool } = pkg;
const app = express();
app.use(express.json());
app.use(express.static("public"));

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "javascriptinfo",
    password: "2001",
    port: 5432
});

// Get all products
app.get("/products", async (req, res) => {
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
    res.json(result.rows);
});

// Add product
app.post("/products", async (req, res) => {
    const { size, color, brand, status } = req.body;
    const result = await pool.query(
        "INSERT INTO products (size, color, brand, status) VALUES ($1,$2,$3,$4) RETURNING *",
        [size, color, brand, status]
    );
    broadcast({ type: "add", product: result.rows[0] });
    res.json(result.rows[0]);
});

// Delete product
app.delete("/products/:id", async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM products WHERE id=$1", [id]);
    broadcast({ type: "delete", id: Number(id) });
    res.json({ success: true });
});

// Toggle or update any field
app.post("/products/:id/update", async (req, res) => {
    const { id } = req.params;
    const fields = req.body; // {size, color, brand, status}
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const setString = keys.map((k, i) => `${k}=$${i + 1}`).join(", ");
    const result = await pool.query(
        `UPDATE products SET ${setString} WHERE id=$${keys.length + 1} RETURNING *`,
        [...values, id]
    );
    broadcast({ type: "update", product: result.rows[0] });
    res.json(result.rows[0]);
});

// Update order after drag & drop
app.post("/products/reorder", async (req, res) => {
    const { order } = req.body; // array of ids in new order
    for (let i = 0; i < order.length; i++) {
        await pool.query("UPDATE products SET id=$1 WHERE id=$2", [i + 1, order[i]]);
    }
    broadcast({ type: "reorder", order });
    res.json({ success: true });
});

// WebSocket setup
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === 1) client.send(JSON.stringify(data));
    });
}

server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, ws => wss.emit("connection", ws, request));
});

server.listen(5000, () => console.log("Server running on port 5000"));
