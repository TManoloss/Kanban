import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createBoard = async (req: Request, res: Response) => {
  try {
    const { title, userId } = req.body;

    // Criar board com colunas padrão
    const newBoard = await prisma.board.create({
      data: {
        title,
        user: {
          connect: {
            id: userId
          }
        },
        columns: {
          create: [
            { title: 'To Do', order: 0 },
            { title: 'In Progress', order: 1 },
            { title: 'Done', order: 2 }
          ]
        }
      },
      include: {
        columns: {
          include: {
            tasks: true
          }
        }
      }
    });

    res.status(201).json({
      ...newBoard,
      createdAt: newBoard.createdAt.toISOString()
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create board',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : null
    });
  }
};

export const getBoards = async (req: Request, res: Response) => {
  try {
    const boards = await prisma.board.findMany({
      include: {
        columns: {
          include: {
            tasks: {
              select: {
                id: true,
                title: true,
                description: true,
                category: true, // Novo campo
                order: true,
                createdAt: true,
                // Status derivado do título da coluna
                column: {
                  select: {
                    title: true
                  }
                }
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Mapear para incluir status nas tasks
    const formattedBoards = boards.map(board => ({
      ...board,
      columns: board.columns.map(column => ({
        ...column,
        tasks: column.tasks.map(task => ({
          ...task,
          status: column.title
        }))
      }))
    }));

    res.json(formattedBoards);

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch boards',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : null
    });
  }
  
};
export const getBoardById = async (req: Request, res: Response) => {
  try {
    const boardId = parseInt(req.params.id);
    
    if (isNaN(boardId)) {
      return res.status(400).json({ error: 'ID do board inválido' });
    }

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        columns: {
          include: {
            tasks: {
              select: {
                id: true,
                title: true,
                description: true,
                category: true,
                order: true,
                createdAt: true,
                column: {
                  select: {
                    title: true
                  }
                }
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!board) {
      return res.status(404).json({ error: 'Board não encontrado' });
    }

    // Formatar tasks com status
    const formattedBoard = {
      ...board,
      columns: board.columns.map(column => ({
        ...column,
        tasks: column.tasks.map(task => ({
          ...task,
          status: column.title
        }))
      }))
    };

    res.json(formattedBoard);

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch board',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : null
    });
  }
};