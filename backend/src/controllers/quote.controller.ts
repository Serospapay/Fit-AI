import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../lib/logger';

// Отримати випадкову цитату
export const getRandomQuote = async (req: Request, res: Response) => {
  try {
    const count = await prisma.quote.count();
    if (count === 0) {
      return res.json({ 
        text: 'Тренування - це не покарання, це нагорода за те, що ти можеш це робити.',
        author: 'Незнайомий'
      });
    }

    const randomSkip = Math.floor(Math.random() * count);
    const quote = await prisma.quote.findFirst({
      skip: randomSkip,
      take: 1,
    });

    res.json(quote);
  } catch (error: unknown) {
    logger.error('Get random quote error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Отримати всі цитати (для адміністратора)
export const getAllQuotes = async (req: Request, res: Response) => {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ quotes });
  } catch (error: unknown) {
    logger.error('Get all quotes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

