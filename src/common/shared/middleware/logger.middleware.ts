import {Injectable, Logger, NestMiddleware} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';
// eslint-disable-next-line n/no-extraneous-import
import chalk from 'chalk';
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
    const parentType = chalk.hex('#87e8de').bold(`${req.baseUrl}`);
    const fieldName = chalk.hex('#87e8de').bold(`${req.method}`);
    Logger.debug(`⛩  ${parentType} » ${fieldName}`, 'Restful');
    next();
  }
}
