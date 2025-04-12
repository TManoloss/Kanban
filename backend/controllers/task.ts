import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, columnId, category } = req.body;

    // Validar categoria
    const validCategories = ['Desenvolvimento', 'Design', 'QA', 'Reunião'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Categoria inválida' });
    }

    // Obter última ordem na coluna
    const lastTask = await prisma.task.findFirst({
      where: { columnId },
      orderBy: { order: 'desc' }
    });

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        category,
        columnId,
        order: lastTask ? lastTask.order + 1 : 0
      }
    });

    res.status(201).json({
      ...newTask,
      status: 'To Do' // Será atualizado pelo frontend via coluna
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create task',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : null
    });
  }
};

export const updateTaskPosition = async (req: Request, res: Response) => {
  try {
    const { taskId, newColumnId, newPosition, preserveCategory } = req.body;

    // Buscar task atual
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Atualizar posição
    await prisma.$transaction([
      // Remover da posição antiga
      prisma.task.updateMany({
        where: { 
          columnId: task.columnId,
          order: { gt: task.order }
        },
        data: { order: { decrement: 1 } }
      }),
      
      // Adicionar na nova posição
      prisma.task.updateMany({
        where: { 
          columnId: newColumnId,
          order: { gte: newPosition }
        },
        data: { order: { increment: 1 } }
      }),
      
      // Atualizar a task
      prisma.task.update({
        where: { id: taskId },
        data: {
          columnId: newColumnId,
          order: newPosition,
          category: preserveCategory ? task.category : 'Geral'
        }
      })
    ]);

    res.json({ message: 'Task moved successfully' });

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to move task',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : null
    });
  }
};