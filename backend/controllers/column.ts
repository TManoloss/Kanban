import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateColumnOrder = async (req: Request, res: Response) => {
  try {
    const { columns } = req.body;
    
    await Promise.all(
      columns.map((col: { id: number, order: number }) => 
        prisma.column.update({
          where: { id: col.id },
          data: { order: col.order }
        })
      )
    );

    res.json({ message: 'Columns reordered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update columns' });
  }
};