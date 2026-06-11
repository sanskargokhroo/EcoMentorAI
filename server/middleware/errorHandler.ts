// File: server/middleware/errorHandler.ts — Global error handling middleware

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors
    });
  }

  // Do not expose internal server errors to the client
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};
