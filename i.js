// importCachedBuilds.js
import fs from "fs";
import path from "path";
import { Pool } from "pg";

const CACHE_DIR = path.join(process.cwd(), "mc-cache/papermc_jars");

const db = new Pool({
    user: "postgres",
    host: "localhost",
    database: "mcdb",
    password: "2001",
    port: 5432,
});

async function importCachedBuilds() {
    const files = fs.readdirSync(CACHE_DIR).filter(f => f.endsWith(".jar"));

    for (const file of files) {
        const match = file.match(/^([a-z]+)-(\d+\.\d+\.\d+)-(\d+)\.jar$/i);
        if (!match) {
            console.log(`Skipping unrecognized file: ${file}`);
            continue;
        }

        const [_, software, version, buildStr] = match;
        const build = parseInt(buildStr, 10);
        const filePath = path.join(CACHE_DIR, file);

        // Check if this build already exists in DB
        const res = await db.query(
            `SELECT id FROM cached_builds WHERE software=$1 AND version=$2 AND build=$3`,
            [software, version, build]
        );

        if (res.rows.length > 0) {
            console.log(`Already in DB: ${file}`);
            continue;
        }

        // Insert into DB
        await db.query(
            `INSERT INTO cached_builds (version, build, software, path) VALUES ($1, $2, $3, $4)`,
            [version, build, software, filePath]
        );

        console.log(`Inserted into DB: ${file}`);
    }

    console.log("Import of cached builds completed!");
}

importCachedBuilds()
    .then(() => process.exit(0))
    .catch(err => {
        console.error("Error importing cached builds:", err);
        process.exit(1);
    });
