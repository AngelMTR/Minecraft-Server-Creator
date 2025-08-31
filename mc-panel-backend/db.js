import pkg from "pg";
const { Pool } = pkg;

// export const pool = new Pool({
//     connectionString: process.env.DATABASE_URL
// });


// این چون رمز دیتابیس فقط عدد بود این کد پایینی رو نوشتم وگر نه باید بالایی باشه
export const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "mcdb",
    password: "2001",  // حتماً رشته باشه
    port: 5432
});