let process = null;

function start() {
    if (isRunning()) return;  // اگر سرور قبلاً در حال اجرا است، دوباره شروع نکن

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
        console.log('[MC] سرور خاموش شد.');
        process = null;
        // بعد از خاموش شدن سرور، دوباره آن را راه‌اندازی می‌کنیم
        setTimeout(start, 5000); // 5 ثانیه بعد دوباره شروع به کار کن
    });
}

function stop() {
    if (process) {
        process.stdin.write('stop\n');
    }
}

function isRunning() {
    return !!process;
}

module.exports = { start, stop, isRunning };
