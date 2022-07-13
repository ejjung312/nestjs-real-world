// https://github.com/dextto/book-nestjs-backend/tree/main/advanced/reflecttion-metadata

import { Module } from '@nestjs/common';
import { MetadataController } from './metadata.controller';

@Module({
  controllers: [MetadataController],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: HandlerRolesGuard,
  //   },
  // ],
})
export class MetadataModule {}
