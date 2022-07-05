import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as config from 'config';
import { setupSwagger } from './util/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  const serverConfig = config.get('server');
  const port = serverConfig.port;
  await app.listen(port);
}
bootstrap();
