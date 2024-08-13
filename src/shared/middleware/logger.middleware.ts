import { Logger } from '@nestjs/common';
import type { NextFunction, Request } from 'express';

export function LoggerMiddleware(req: Request, next: NextFunction) {
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
