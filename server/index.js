import Fastify from "fastify";
import {Model} from "objection";
import Knex from "knex";
import User from "./models/User.js";

// لود کردن knexfile به صورت داینامیک
const knexConfig = await import("../knexfile.js").then(m => m.default || m);

const fastify = Fastify({ logger: true });

// راه‌اندازی Knex و اتصال آن به Objection.js
const knex = Knex(knexConfig.development);
Model.knex(knex);

// تست اتصال به دیتابیس
try {
    await knex.raw("SELECT 1+1 AS result");
    console.log("Database connected successfully!");
} catch (err) {
    console.error("Database connection failed:", err);
}

// تعریف روت /users برای دریافت لیست کاربران
fastify.get("/users", async (request, reply) => {
    try {
        return await User.query();
    } catch (err) {
        console.error("Error fetching users:", err);
        return reply.status(500).send({ error: "Failed to fetch users" });
    }
});

fastify.get("/users/:id", async (request, reply) => {
    try {
        const { id } = request.params;
        const user = await User.query().findById(id);
        if (!user) {
            return reply.status(404).send({ error: "User not found" });
        }
        return user;
    } catch (err) {
        console.error("Error fetching user:", err);
        return reply.status(500).send({ error: "Failed to fetch user" });
    }
});


// راه‌اندازی سرور Fastify
const start = async () => {
    try {
        await fastify.listen({
            port: 3000,
            host: "localhost",
        });
        console.log("Server running on port 3000");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
