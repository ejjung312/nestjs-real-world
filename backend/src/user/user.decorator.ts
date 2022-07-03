import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  // !! -> 확실한 논리결과를 위해
  // 정의되지 않은 변수(undefined)에 논리 연산 시 ture/false를 가지게 하는 목적
  if (!!request.user) {
    return !!data ? request.user[data] : request.user;
  }
});
