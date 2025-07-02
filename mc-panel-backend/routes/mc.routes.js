const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { startServer, stopServer, getStatus, sendCommand, getLogs } = require('../controllers/mc.controller');
router.use(auth);

router.post('/start', startServer);
router.post('/stop', stopServer);
router.get('/status', getStatus);
router.post('/command', sendCommand);
router.get('/logs', getLogs);

module.exports = router;
