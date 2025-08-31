// syncCacheWithDB.js
import fs from "fs";
import path from "path";
import { Pool } from "pg";

const CACHE_DIR = path.join(process.cwd(), "mc-cache");

const db = new Pool({
    user: "postgres",
    host: "localhost",
    database: "mcdb",
    password: "2001",
    port: 5432,
});

async function syncCacheWithDB() {
    // 1️⃣ Read all files in mc-cache
    const files = fs.readdirSync(CACHE_DIR).filter((f) => f.endsWith(".jar"));

    // 2️⃣ Parse filenames like "paper-1.21.8-57.jar"
    const parsedFiles = files.map((f) => {
        const match = f.match(/^([a-z]+)-(\d+\.\d+\.\d+)-(\d+)\.jar$/i);
        if (!match) return null;
        const [, software, version, build] = match;
        return { filename: f, software, version, build: parseInt(build, 10), path: path.join(CACHE_DIR, f) };
    }).filter(Boolean);

    // 3️⃣ Fetch all cached builds from DB
    const { rows: dbBuilds } = await db.query("SELECT id, version, build, software, path FROM cached_builds");

    // 4️⃣ Compare and insert new builds
    for (const file of parsedFiles) {
        const existsInDB = dbBuilds.some(
            (b) => b.version === file.version && b.build === file.build && b.software === file.software
        );

        if (!existsInDB) {
            await db.query(
                `INSERT INTO cached_builds (version, build, software, path) VALUES ($1, $2, $3, $4)`,
                [file.version, file.build, file.software, file.path]
            );
            console.log(`Added ${file.filename} to cached_builds table.`);
        }
    }

    // 5️⃣ Optionally, remove DB entries for missing files
    for (const dbRow of dbBuilds) {
        if (!fs.existsSync(dbRow.path)) {
            await db.query("DELETE FROM cached_builds WHERE id=$1", [dbRow.id]);
            console.log(`Removed missing file from DB: ${dbRow.path}`);
        }
    }

    console.log("Cache sync completed!");
}

// Example usage
syncCacheWithDB()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("Error syncing cache:", err);
        process.exit(1);
    });
