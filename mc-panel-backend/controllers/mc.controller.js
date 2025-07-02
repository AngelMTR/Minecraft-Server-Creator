const mc = require('../mc/process');

exports.startServer = (req, res) => {
    if (mc.isRunning()) return res.status(400).json({ message: 'سرور قبلاً روشن شده.' });
    mc.start();
    res.json({ message: 'سرور در حال روشن شدن است.' });
};

exports.stopServer = (req, res) => {
    if (!mc.isRunning()) return res.status(400).json({ message: 'سرور اجرا نمی‌شود.' });
    mc.stop();
    res.json({ message: 'دستور خاموشی ارسال شد.' });
};

exports.getStatus = (req, res) => {
    res.json({ running: mc.isRunning() });
};

exports.sendCommand = (req, res) => {
    const { command } = req.body;
    if (!mc.isRunning()) return res.status(400).json({ message: 'سرور اجرا نمی‌شود.' });
    mc.sendCommand(command);
    res.json({ message: `دستور '${command}' ارسال شد.` });
};
