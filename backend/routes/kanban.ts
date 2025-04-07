import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createBoard,
  getBoards
} from '../controllers/board';
import {
  updateColumnOrder
} from '../controllers/column';
import {
  createTask,
  updateTaskPosition
} from '../controllers/task';

const router = Router();

// Boards
router.post('/boards', (req, res, next) => {createBoard(req ,res);});
router.get('/boards', (req, res, next) => { getBoards(req, res)});

// Columns
router.put('/columns/order', (req, res, next) => {updateColumnOrder(req, res)});

// Tasks
router.post('/tasks', (req, res, next) => {createTask(req, res)});
router.put('/tasks/position', (req, res, next) => {updateColumnOrder(req, res)});

export default router;