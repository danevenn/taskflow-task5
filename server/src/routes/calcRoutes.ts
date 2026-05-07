import { Router } from 'express';
import { calcController } from '../controllers/calcController';

export const calcRouter = Router();

calcRouter.post('/', calcController.compute);
