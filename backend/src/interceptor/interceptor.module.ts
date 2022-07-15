import { Logger, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LogginInterceptor } from './LoggingInterceptor';

@Module({
  controllers: [],
  providers: [
    Logger,
    { provide: APP_INTERCEPTOR, useClass: LogginInterceptor },
  ],
})
export class InterceptorModule {}
