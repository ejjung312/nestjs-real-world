import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class Logger2Middleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request2 ...');

    // 응답을 해서 마음 미들웨어가 동작하지 않음
    // res.send('DONE');
    next();
  }
}
