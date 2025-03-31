import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 500) {
    super(message);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.warn(`Error controlado: ${err.message}`);
    return res.status(err.statusCode).json({ error: err.message });
  }

  logger.error(`Error no controlado: ${err.message}`, { stack: err.stack });
  res.status(500).json({ error: 'Ocurrió un error interno' });
};