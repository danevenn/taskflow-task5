import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

export const buildApp = () => {
  const app = express();
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());

  app.use('/api/v1', apiRouter);

  app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found', code: 'NOT_FOUND' });
  });

  app.use(errorHandler);
  return app;
};
