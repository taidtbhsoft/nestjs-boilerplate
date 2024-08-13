import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Log parameters if exists
    if (Object.keys(req.query).length > 0) {
      Logger.debug(`📢  ${JSON.stringify(req.query)}`, 'Request parameters');
    }

    // Log body if exists
    if (Object.keys(req.body).length > 0) {
      Logger.debug(`📢  ${JSON.stringify(req.body)}`, 'Request body');
    }

    next();
  }
}
