import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createBoard = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const board = await prisma.board.create({
      data: {
        title,
        userId,
        columns: {
          createMany: {
            data: [
              { title: 'To Do', order: 0 },
              { title: 'In Progress', order: 1 },
              { title: 'Done', order: 2 }
            ]
          }
        }
      },
      include: { columns: true }
    });

    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create board' });
  }
};

export const getBoards = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const boards = await prisma.board.findMany({
      where: { userId },
      include: { columns: { include: { tasks: true } } }
    });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
};