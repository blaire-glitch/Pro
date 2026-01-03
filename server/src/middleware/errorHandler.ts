import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

export class ApiError extends Error {
  statusCode: number;
  code?: string;

  constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, code?: string) {
    return new ApiError(400, message, code);
  }

  static unauthorized(message: string = 'Unauthorized', code?: string) {
    return new ApiError(401, message, code);
  }

  static forbidden(message: string = 'Forbidden', code?: string) {
    return new ApiError(403, message, code);
  }

  static notFound(message: string = 'Not found', code?: string) {
    return new ApiError(404, message, code);
  }

  static conflict(message: string, code?: string) {
    return new ApiError(409, message, code);
  }

  static internal(message: string = 'Internal server error', code?: string) {
    return new ApiError(500, message, code);
  }
}
