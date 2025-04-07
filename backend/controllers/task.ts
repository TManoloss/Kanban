import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, columnId } = req.body;
    
    const taskCount = await prisma.task.count({ where: { columnId } });
    
    const task = await prisma.task.create({
      data: {
        title,
        description,
        order: taskCount,
        columnId
      }
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTaskPosition = async (req: Request, res: Response) => {
  try {
    const { taskId, newColumnId, newPosition } = req.body;

    await prisma.$transaction(async (tx) => {
      // Atualiza posições das outras tasks
      await tx.task.updateMany({
        where: { columnId: newColumnId, order: { gte: newPosition } },
        data: { order: { increment: 1 } }
      });

      // Move a task
      await tx.task.update({
        where: { id: taskId },
        data: { columnId: newColumnId, order: newPosition }
      });
    });

    res.json({ message: 'Task moved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to move task' });
  }
};