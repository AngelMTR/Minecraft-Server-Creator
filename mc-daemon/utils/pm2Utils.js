import pm2 from 'pm2';

export function startServer(name, cwd) {
    return new Promise((resolve, reject) => {
        pm2.connect(err => {
            if (err) return reject(err);
            pm2.start({
                name,
                cwd,
                script: 'java',
                args: ['-Xms4096M', '-Xmx4096M', '-jar', 'server.jar', 'nogui'],
            }, (err, proc) => {
                pm2.disconnect();
                if (err) reject(err);
                else resolve(proc);
            });
        });
    });
}
