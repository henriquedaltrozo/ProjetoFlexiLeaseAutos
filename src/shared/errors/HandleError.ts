import { Response } from 'express';

export function handleError(res: Response, error: any): Response {
  if (error instanceof Error) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    const message =
      error.message === 'JWT token is missing'
        ? 'JWT token is missing'
        : error.message;
    return res.status(statusCode).json({
      code: statusCode,
      status: statusCode === 404 ? 'Not Found' : 'Bad Request',
      message: message,
      details: [],
    });
  } else {
    return res.status(500).json({
      code: 500,
      status: 'Internal Server Error',
      message: 'Ocorreu um erro inesperado.',
      details: [],
    });
  }
}
