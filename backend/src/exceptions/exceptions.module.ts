import { Module } from '@nestjs/common';
import { ExceptionsController } from './exceptions.controller';

@Module({
  // 전역 필터를 사용할 경우 의존성 주입을 받고싶다면 커스텀 프로바이더로 등록해야 함
  // providers: [
  //   {
  //     provide: APP_FILTER,
  //     useClass: HttpExceptionFilter,
  //   },
  // ],
  controllers: [ExceptionsController],
})
export class ExceptionsModule {}
