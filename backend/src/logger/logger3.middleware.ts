import { NextFunction, Request, Response } from 'express';

/*
  함수로 만든 미들웨어는 DI 컨테이너를 사용할 수 없다.
  => 프로바이더를 주입받아 사용할 수 없다.
*/
export function logger3(req: Request, res: Response, next: NextFunction) {
  console.log('logger function ...');
  next();
}
