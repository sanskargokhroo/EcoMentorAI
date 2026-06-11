// File: server/routes/api.ts — API route definitions

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { calculateAndCoach, handleScanReceipt, handleParseVoice, handleSortWaste, handleAnalyzeProduct, handleTimeMachine } from '../controllers/carbonController.js';

const router = Router();

// SECURITY: Strict rate limit for AI endpoint (10 requests per minute)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many AI requests from this IP, please try again later.',
});

router.post('/calculate', aiLimiter, calculateAndCoach);
router.post('/scan-receipt', aiLimiter, handleScanReceipt);
router.post('/parse-voice', aiLimiter, handleParseVoice);
router.post('/sort-waste', aiLimiter, handleSortWaste);
router.post('/analyze-product', aiLimiter, handleAnalyzeProduct);
router.post('/time-machine', aiLimiter, handleTimeMachine);

export default router;
