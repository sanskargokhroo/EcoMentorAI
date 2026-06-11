// File: server/index.ts — Main Express server setup

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// SECURITY: Use Helmet for strict CSP headers and other security headers
app.use(helmet());

// SECURITY: Configure CORS for allowed origins only
// Relaxed for hackathon dev environment to handle multiple vite dev servers (5173, 5174, etc)
app.use(cors());

// SECURITY: Parse JSON bodies and sanitize against NoSQL injection
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());

// SECURITY: Global Rate Limiting - 100 requests per 15 minutes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app; // For testing
// Triggering restart 1
