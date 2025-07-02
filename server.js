const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 3000;

let mcProcess = null;

app.get('/start', (req, res) => {
    if (mcProcess) {
        return res.status(400).send('سرور قبلاً روشن شده.');
    }

    mcProcess = spawn('java', ['-Xms8192M', '-Xmx8192M', '-jar', 'server.jar', 'nogui'], {
        cwd: './minecraft', // مسیر فولدر سرور
    });

    mcProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    mcProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    mcProcess.on('close', (code) => {
        console.log(`سرور بسته شد با کد خروج: ${code}`);
        mcProcess = null;
    });

    res.send('سرور ماینکرفت روشن شد.');
});

app.get('/stop', (req, res) => {
    if (!mcProcess) {
        return res.status(400).send('سرور در حال اجرا نیست.');
    }

    mcProcess.stdin.write('stop\n'); // ارسال دستور stop به سرور ماینکرفت
    res.send('در حال خاموش کردن سرور...');
});

app.listen(port, () => {
    console.log(`🟢 API روی پورت ${port} در حال اجرا است`);
});
