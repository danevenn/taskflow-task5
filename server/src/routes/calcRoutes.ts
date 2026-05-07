import { Router } from 'express';
import { calcController } from '../controllers/calcController.js';

export const calcRouter = Router();

calcRouter.post('/', calcController.compute);
