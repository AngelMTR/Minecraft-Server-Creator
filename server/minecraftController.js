// server/minecraftController.js
const { spawn } = require('child_process');

function startMinecraftServer(serverConfig) {
    // فرض کنید فایل server.jar در دایرکتوری مشخص شده وجود دارد
    const process = spawn('java', ['-jar', 'server.jar', 'nogui'], {
        cwd: serverConfig.directory,
        detached: true,
    });

    process.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    process.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    process.on('close', (code) => {
        console.log(`Minecraft server exited with code ${code}`);
        // در صورت نیاز می‌توانید وضعیت سرور را به stopped تغییر دهید
    });

    return process;
}

module.exports = { startMinecraftServer };
