import express from "express";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "javascriptinfo",
    password: "2001",
    port: 5432
});

// همه محصولات
app.get("/products", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// محصول با id مشخص
app.get("/products/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM products WHERE id=$1", [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
