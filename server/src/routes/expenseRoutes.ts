import { Router } from 'express';
import { expenseController } from '../controllers/expenseController.js';

export const expenseRouter = Router();

expenseRouter.get('/', expenseController.list);
expenseRouter.get('/:id', expenseController.get);
expenseRouter.post('/', expenseController.create);
expenseRouter.patch('/:id', expenseController.update);
expenseRouter.delete('/:id', expenseController.remove);
