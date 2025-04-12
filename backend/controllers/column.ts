import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateColumnOrder = async (req: Request, res: Response) => {
  try {
    const { columns } = req.body;

    // Verificação de segurança
    if (!Array.isArray(columns)) {
      return res.status(400).json({ error: 'Formato inválido para ordenação' });
    }

    // Transação para atualização atômica
    await prisma.$transaction(
      columns.map((col: { id: number, order: number }) => 
        prisma.column.update({
          where: { id: col.id },
          data: { order: col.order }
        })
      )
    );

    res.json({ 
      message: 'Columns reordered successfully',
      updatedColumns: columns.length
    });
    
  } catch (error) {
    console.error('Error updating columns:', error);
    res.status(500).json({ 
      error: 'Failed to update columns',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : null
    });
  }
};

// Novo endpoint para criar coluna com ordem automática
export const createColumn = async (req: Request, res: Response) => {
  try {
    const { title, boardId } = req.body;

    // Encontrar a última ordem existente
    const lastOrder = await prisma.column.findFirst({
      where: { boardId },
      orderBy: { order: 'desc' },
      select: { order: true }
    });

    const newOrder = lastOrder ? lastOrder.order + 1 : 0;

    const newColumn = await prisma.column.create({
      data: {
        title,
        boardId,
        order: newOrder,
        tasks: {
          create: []
        }
      },
      include: {
        tasks: true
      }
    });

    res.status(201).json(newColumn);

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create column',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : null
    });
  }
};