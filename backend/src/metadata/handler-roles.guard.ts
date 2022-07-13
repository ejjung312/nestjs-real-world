import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

/*
1. 컨트롤러에 @UseGuard() 데코레이터로 선언해 주거나 (metadata.controller.ts)
2. 커스텀 프로바이터로 제공해 주어야 합니다. (metadata.module.ts)
*/
@Injectable()
export class HandlerRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const userId = 'user-id'; // JWT를 검증해서 얻은 유저ID라고 가정. request.user 객체에서 얻음.
    const userRole = this.getUserRole(userId);

    // const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // const roles = this.reflector.get<string[]>('roles', context.getClass()); // 클래스에 적용 시 context.getClass() 사용
    const roles = this.reflector.getAllAndMerge<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]); // 핸들러와 클래스에 정의된 메타데이터를 모두 리스트로 합쳐 가져옴

    return roles?.includes(userRole) ?? true;
  }

  private getUserRole(userId: string): string {
    return 'user';
    // return 'admin';
  }
}
