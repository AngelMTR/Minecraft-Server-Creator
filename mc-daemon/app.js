import express from 'express';
import serversRoutes from './routes/servers.js';
import buildsRoutes from './routes/builds.js';
import authRoutes from './routes/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(express.json());

// routes
app.use('/auth', authRoutes);
app.use('/servers', serversRoutes);
app.use('/builds', buildsRoutes);

// error handling
app.use(errorHandler);

export default app;
