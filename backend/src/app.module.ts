import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModule } from './article/article.module';
import { typeOrmConfig } from './configs/typeorm.config';
import { CronModule } from './cron/cron.module';
import { ExceptionsModule } from './exceptions/exceptions.module';
import { HealthCheckController } from './health-check/health-check.controller';
import { InterceptorModule } from './interceptor/interceptor.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { Logger2Middleware } from './logger/logger2.middleware';
import { MetadataModule } from './metadata/metadata.module';
import { NestWinstonModule } from './nest-winston/nest-winston.module';
import { PipesModule } from './pipes/pipes.module';
import { ProfileModule } from './profile/profile.module';
import { TagModule } from './tag/tag.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    ProfileModule,
    ArticleModule,
    TagModule,
    PipesModule,
    MetadataModule,
    NestWinstonModule,
    ExceptionsModule,
    InterceptorModule,
    CronModule,
    TerminusModule,
    HttpModule,
  ],
  controllers: [HealthCheckController],
  providers: [HealthCheckController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // consumer.apply(LoggerMiddleware, Logger2Middleware).forRoutes('/user');
    consumer
      .apply(LoggerMiddleware, Logger2Middleware)
      // .exclude({ path: 'user', method: RequestMethod.GET }) // 미들웨어를 적용하지 않을 라우팅 경로
      .forRoutes(UserController);
  }
}
