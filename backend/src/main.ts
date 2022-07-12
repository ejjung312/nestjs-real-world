import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as config from 'config';
import { logger3 } from './logger/logger3.middleware';
import { setupSwagger } from './util/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역 미들웨어
  // use는 클래스를 인자로 받을 수 없기 때문에 함수로 미들웨어를 정의
  app.use(logger3);

  setupSwagger(app);

  const serverConfig = config.get('server');
  const port = serverConfig.port;
  await app.listen(port);
}
bootstrap();
