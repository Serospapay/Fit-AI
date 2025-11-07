import { Request, Response } from 'express';
import { Quote } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { handleControllerError } from '../utils/apiResponse';
import cache from '../services/cache';

const QUOTES_CACHE_KEY = 'quotes:all';
const QUOTES_CACHE_TTL = 10 * 60 * 1000; // 10 хвилин

// Отримати випадкову цитату
export const getRandomQuote = async (req: Request, res: Response) => {
  try {
    let quotes = cache.get<Quote[]>(QUOTES_CACHE_KEY);

    if (!quotes) {
      quotes = await prisma.quote.findMany();
      cache.set(QUOTES_CACHE_KEY, quotes, QUOTES_CACHE_TTL);
    }

    if (!quotes || quotes.length === 0) {
      return res.json({
        text: 'Тренування - це не покарання, це нагорода за те, що ти можеш це робити.',
        author: 'Незнайомий',
      });
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    res.json(quote);
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'QuoteController',
      operation: 'getRandomQuote',
      errorTitle: 'Помилка отримання цитати',
      userMessage: 'Не вдалося завантажити мотиваційну цитату.',
    });
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
    return handleControllerError(res, error, {
      controller: 'QuoteController',
      operation: 'getAllQuotes',
      errorTitle: 'Помилка отримання цитат',
      userMessage: 'Не вдалося завантажити список цитат.',
    });
  }
};

