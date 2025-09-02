import { config } from '../daemon.config.js';
import * as pm2Utils from '../utils/pm2Utils.js';
import fs from 'fs-extra';
import path from 'path';

export async function createServer(userId, version) {
    // ensure jar exists
    const jarPath = path.join(config.cacheDir, `paper-${version}.jar`);
    if (!fs.existsSync(jarPath)) {
        throw new Error(`Version ${version} not cached`);
    }

    // make new server folder
    const serverName = `user${userId}-server${Date.now()}`;
    const serverPath = path.join(config.serversDir, serverName);
    await fs.ensureDir(serverPath);
    await fs.copyFile(jarPath, path.join(serverPath, "server.jar"));

    // accept EULA
    await fs.writeFile(path.join(serverPath, "eula.txt"), "eula=true");

    // run with pm2
    await pm2Utils.startServer(serverName, serverPath);

    return { serverName, path: serverPath };
}
