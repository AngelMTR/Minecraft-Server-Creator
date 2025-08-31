const { Client } = require('ssh2');
const fs = require('fs');

async function createFolderOnServer() {
    const conn = new Client();

    const sshConfig = {
        host: '192.168.157.128',
        username: 'dana',
        password: '2001',
        // یا:
        // privateKey: fs.readFileSync('مسیر/به/کلید/خصوصی')
    };

    try {
        await new Promise((resolve, reject) => {
            conn.on('ready', resolve).on('error', reject).connect(sshConfig);
        });

        console.log('اتصال SSH برقرار شد');

        // 1. استفاده از مسیر قابل دسترسی (مثلاً مسیر خانگی کاربر)
        const folderPath = `/home/${sshConfig.username}/new-folder`;

        // 2. استفاده از mkdir -p برای ایجاد مسیرهای تودرتو
        // 3. افزودن دستور بررسی وجود پوشه
        const command = `if [ ! -d "${folderPath}" ]; then mkdir -p ${folderPath}; fi`;

        const { code, stdout, stderr } = await new Promise((resolve, reject) => {
            conn.exec(command, (err, stream) => {
                if (err) return reject(err);

                let stdout = '';
                let stderr = '';

                stream.on('data', (data) => stdout += data)
                    .stderr.on('data', (data) => stderr += data)
                    .on('close', (code) => {
                        resolve({ code, stdout, stderr });
                    });
            });
        });

        if (code !== 0) {
            throw new Error(`خطا در اجرای دستور (کد ${code}): ${stderr || 'بدون پیام خطا'}`);
        }

        console.log(`پوشه ${folderPath} با موفقیت ایجاد شد`);
        console.log('خروجی:', stdout);
        return true;
    } catch (error) {
        console.error('خطا:', error.message);
        return false;
    } finally {
        conn.end();
    }
}

createFolderOnServer();