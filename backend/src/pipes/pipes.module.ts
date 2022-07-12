import { Module } from '@nestjs/common';
import { PipesController } from './pipes.controller';

@Module({
  controllers: [PipesController],
})
export class PipesModule {}
