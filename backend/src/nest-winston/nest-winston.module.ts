import { Module } from '@nestjs/common';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { NestWinstonController } from './nest-winston.controller';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            utilities.format.nestLike('MyApp', { prettyPrint: true }),
          ),
        }),
      ],
    }),
  ],
  controllers: [NestWinstonController],
})
export class NestWinstonModule {}
