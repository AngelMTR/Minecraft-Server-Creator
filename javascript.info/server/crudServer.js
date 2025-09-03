import express from "express";
import pkg from "pg";
const { Pool } = pkg;

const app = express();

// برای اینکه بدنه‌ی JSON رو توی POST/PUT بخونیم
app.use(express.json());

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "javascriptinfo",
    password: "2001",
    port: 5432
});

/* ----------------------
   CRUD Routes
---------------------- */

// همه محصولات + امکان فیلتر، جستجو و مرتب‌سازی
// مثال: /products?color=Red&sort=asc&limit=5
app.get("/products", async (req, res) => {
    try {
        const { color, brand, sort = "asc", limit } = req.query;

        let query = "SELECT * FROM products";
        let conditions = [];
        let values = [];

        if (color) {
            values.push(color);
            conditions.push(`color = $${values.length}`);
        }
        if (brand) {
            values.push(brand);
            conditions.push(`brand = $${values.length}`);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += ` ORDER BY id ${sort.toUpperCase() === "DESC" ? "DESC" : "ASC"}`;
        if (limit) query += ` LIMIT ${parseInt(limit)}`;

        const result = await pool.query(query, values);
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

// اضافه کردن محصول جدید
app.post("/products", async (req, res) => {
    console.log('req.body', req.body)
    const { size, color, brand } = req.body;
    if (!size || !color || !brand) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const result = await pool.query(
            "INSERT INTO products (size, color, brand) VALUES ($1, $2, $3) RETURNING *",
            [size, color, brand]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ویرایش محصول (PUT = جایگزینی کامل، PATCH = تغییر بخشی)
app.put("/products/:id", async (req, res) => {
    const { id } = req.params;
    const { size, color, brand } = req.body;
    try {
        const result = await pool.query(
            "UPDATE products SET size=$1, color=$2, brand=$3 WHERE id=$4 RETURNING *",
            [size, color, brand, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// تغییر جزئی (PATCH)
app.patch("/products/:id", async (req, res) => {
    const { id } = req.params;
    const fields = Object.keys(req.body);
    const values = Object.values(req.body);

    if (fields.length === 0) return res.status(400).json({ error: "No fields to update" });

    const setQuery = fields.map((f, i) => `${f}=$${i + 1}`).join(", ");

    try {
        const result = await pool.query(
            `UPDATE products SET ${setQuery} WHERE id=$${fields.length + 1} RETURNING *`,
            [...values, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// حذف محصول
app.delete("/products/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM products WHERE id=$1 RETURNING *", [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
        res.json({ message: "Product deleted", product: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ----------------------
   Error Handling
---------------------- */
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(6000, () => console.log("Server running on port 5000"));
