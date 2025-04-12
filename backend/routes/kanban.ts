import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createBoard,
  getBoards,
  getBoardById
} from '../controllers/board';
import {
  updateColumnOrder
} from '../controllers/column';
import {
  createTask,
  updateTaskPosition
} from '../controllers/task';

const routerKanban = Router();

// Boards
routerKanban.post('/boards', (req, res, next) => {createBoard(req ,res);});
routerKanban.get('/boards', (req, res, next) => { getBoards(req, res)});
routerKanban.get('/:id', (req, res) =>  {getBoardById(req, res)});

// Columns
routerKanban.put('/columns/order', (req, res, next) => {updateColumnOrder(req, res)});

// Tasks
routerKanban.post('/tasks', (req, res, next) => {createTask(req, res)});
routerKanban.put('/tasks/position', (req, res, next) => {updateColumnOrder(req, res)});

export default routerKanban ;