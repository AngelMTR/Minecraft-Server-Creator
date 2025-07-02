const { spawn } = require('child_process');
let process = null;
function start() {
    process = spawn('java', ['-Xms1024M', '-Xmx1024M', '-jar', 'server.jar', 'nogui'], {
        cwd: './mc',
    });

    process.stdout.on('data', (data) => {
        console.log(`[MC] ${data}`);
    });

    process.stderr.on('data', (data) => {
        console.error(`[MC] خطا: ${data}`);
    });

    process.on('close', () => {
        process = null;
        console.log('[MC] سرور خاموش شد.');
    });
}

function stop() {
    process.stdin.write('stop\n');
}

function sendCommand(cmd) {
    process.stdin.write(cmd + '\n');
}

function isRunning() {
    return !!process;
}

module.exports = { start, stop, isRunning, sendCommand };
