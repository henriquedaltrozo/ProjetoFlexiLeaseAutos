import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { handleError } from '../../../shared/errors/HandleError';

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return handleError(res, new Error('JWT token is missing'));
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as TokenPayload;

    req.user = {
      id: decoded.id,
    };

    return next();
  } catch {
    return handleError(res, new Error('Invalid JWT token'));
  }
}
