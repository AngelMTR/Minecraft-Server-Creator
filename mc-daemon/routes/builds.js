import express from 'express';
import { buildController } from '../controllers/buildController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

// check all cached builds
router.get('/', buildController.listBuilds);

// check a version
router.get('/:version', buildController.getBuild);

// download a version
router.post('/:version', buildController.downloadBuild);

export default router;
