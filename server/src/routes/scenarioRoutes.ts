import { Router } from 'express';
import { scenarioController } from '../controllers/scenarioController.js';

export const scenarioRouter = Router();

scenarioRouter.get('/', scenarioController.list);
scenarioRouter.get('/:id', scenarioController.get);
scenarioRouter.post('/', scenarioController.create);
scenarioRouter.delete('/:id', scenarioController.remove);
