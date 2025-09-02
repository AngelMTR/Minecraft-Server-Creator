import fs from 'fs-extra';
import path from 'path';
import fetch from 'node-fetch';
import { config } from '../daemon.config.js';

export const buildService = {
    listBuilds: async () => {
        const files = await fs.readdir(config.cacheDir);
        return files.filter(f => f.endsWith('.jar'));
    },

    getBuild: async (version) => {
        const files = await fs.readdir(config.cacheDir);
        const found = files.find(f => f.startsWith(`paper-${version}`));
        if (!found) throw new Error(`Version ${version} not cached`);
        return { filename: found };
    },

    downloadBuild: async (version) => {
        // Example: get latest build from PaperMC API
        const versionsRes = await fetch(`https://api.papermc.io/v2/projects/paper/versions/${version}`);
        if (!versionsRes.ok) throw new Error('Version not found in PaperMC API');
        const data = await versionsRes.json();
        const latestBuild = Math.max(...data.builds);

        const jarUrl = `https://api.papermc.io/v2/projects/paper/versions/${version}/builds/${latestBuild}/downloads/paper-${version}-${latestBuild}.jar`;
        const res = await fetch(jarUrl);
        if (!res.ok) throw new Error('Failed to download jar');

        const jarPath = path.join(config.cacheDir, `paper-${version}-${latestBuild}.jar`);
        const buffer = await res.arrayBuffer();
        await fs.writeFile(jarPath, Buffer.from(buffer));

        return { filename: path.basename(jarPath), path: jarPath };
    }
};
