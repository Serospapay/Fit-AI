import { Router } from 'express';
import { getRandomQuote, getAllQuotes } from '../controllers/quote.controller';

const router = Router();

router.get('/random', getRandomQuote);
router.get('/', getAllQuotes);

export default router;

