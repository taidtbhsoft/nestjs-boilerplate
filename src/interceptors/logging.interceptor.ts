import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import chalk from 'chalk';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const parentType = chalk
      .hex('#87e8de')
      .bold(`${context.getArgs()[0].route.path}`);
    const fieldName = chalk
      .hex('#87e8de')
      .bold(`${context.getArgs()[0].route.stack[0].method}`);

    return next.handle().pipe(
      tap(() => {
        Logger.debug(`⛩  ${parentType} » ${fieldName}`, 'Restful');
        // console.log(context.getArgs()[0]['route']);
      }),
    );
  }
}
