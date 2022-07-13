import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as config from 'config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { logger3 } from './logger/logger3.middleware';
import { setupSwagger } from './util/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역 미들웨어
  // use는 클래스를 인자로 받을 수 없기 때문에 함수로 미들웨어를 정의
  app.use(logger3);

  // 전역 로거 사용 - user 컨트롤러 참고
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // 전역 예외필터
  // app.useGlobalFilters(new HttpExceptionFilter());

  setupSwagger(app);

  const serverConfig = config.get('server');
  const port = serverConfig.port;
  await app.listen(port);
}
bootstrap();
