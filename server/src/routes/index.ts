import { Router } from 'express';
import { expenseRouter } from './expenseRoutes.js';
import { scenarioRouter } from './scenarioRoutes.js';
import { calcRouter } from './calcRoutes.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

apiRouter.use('/expenses', expenseRouter);
apiRouter.use('/scenarios', scenarioRouter);
apiRouter.use('/calc', calcRouter);
