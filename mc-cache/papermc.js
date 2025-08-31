import fs from "fs";
import https from "https";
import path from "path";

const downloadDir = "./papermc_jars";
if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

function httpsGetJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                try { resolve(JSON.parse(data)); }
                catch (err) { reject(err); }
            });
        }).on("error", reject);
    });
}

function downloadFile(url, filename) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filename)) {
            console.log(`✅ Already exists: ${filename}`);
            return resolve(); // اگر قبلا دانلود شده، رد کن
        }

        const file = fs.createWriteStream(filename);
        https.get(url, (res) => {
            res.pipe(file);
            file.on("finish", () => {
                file.close();
                console.log(`✅ Downloaded: ${filename}`);
                resolve();
            });
        }).on("error", (err) => {
            fs.unlinkSync(filename); // فایل نیمه‌کاره حذف میشه
            reject(err);
        });
    });
}

async function downloadAllPaperVersions() {
    try {
        const projectInfo = await httpsGetJSON("https://api.papermc.io/v2/projects/paper");
        const versions = projectInfo.versions;
        console.log(`Found ${versions.length} PaperMC versions.`);

        for (const version of versions) {
            const versionInfo = await httpsGetJSON(`https://api.papermc.io/v2/projects/paper/versions/${version}`);
            const latestBuild = Math.max(...versionInfo.builds);
            const jarName = `paper-${version}-${latestBuild}.jar`;
            const jarPath = path.join(downloadDir, jarName);
            const downloadUrl = `https://api.papermc.io/v2/projects/paper/versions/${version}/builds/${latestBuild}/downloads/${jarName}`;

            try {
                await downloadFile(downloadUrl, jarPath);
            } catch (err) {
                console.error(`❌ Failed to download ${jarName}: ${err.message}`);
                console.log("⏳ Retrying in 5 seconds...");
                await new Promise(res => setTimeout(res, 5000));
                await downloadFile(downloadUrl, jarPath); // تلاش دوباره
            }
        }

        console.log("🎉 All versions downloaded!");
    } catch (err) {
        console.error(err);
    }
}

downloadAllPaperVersions();
