import { AuthPayload } from '@auth/interfaces/auth.interface';
import { NotAuthorizedError } from '@global/helpers/error-handler';
import { config } from '@root/config';
import { NextFunction, Request, Response } from 'express';
import JWT from 'jsonwebtoken';

export class AuthMiddleware {
  public verifyUser(req: Request, _res: Response, next: NextFunction): void {
    if (!req.session?.jwt) {
      throw new NotAuthorizedError('Token is not available. Please login again.');
    }

    try {
      const payload: AuthPayload = JWT.verify(req.session?.jwt, config.JWT_TOKEN!) as AuthPayload;
      req.currentUser = payload;
    } catch (error) {
      throw new NotAuthorizedError('Token is not available. Please login again.');
    }
    next();
  }

  public checkAuthentication(req: Request, _res: Response, next: NextFunction): void {
    if (!req.currentUser) {
      throw new NotAuthorizedError('You are not authorized to perform this action');
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
