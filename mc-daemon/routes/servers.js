import express from 'express';
import * as serverController from '../controllers/serverController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.post('/create', serverController.createServer);
router.post('/:id/start', serverController.startServer);
router.post('/:id/stop', serverController.stopServer);
router.get('/', serverController.listServers);

export default router;