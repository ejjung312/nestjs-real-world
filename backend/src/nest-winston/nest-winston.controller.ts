import { Controller, Get, Inject } from '@nestjs/common';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller('nest-winston')
export class NestWinstonController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
  ) {}

  @Get()
  async test1() {
    const test = {
      a: 1,
      b: 2,
      c: ['d', 'e', 'f'],
    };
    console.log(NestWinstonController.name);

    this.logger.log('log: ', JSON.stringify(test));
    this.logger.error('error: ', JSON.stringify(test));
    this.logger.warn('warn: ', JSON.stringify(test));
    this.logger.verbose('verbose: ', JSON.stringify(test));
    this.logger.debug('debug: ', JSON.stringify(test));
  }
}
