import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'], // 모든 엔티티를 포함
  synchronize: dbConfig.synchronize, // 서비스가 실행되고 데이터베이스가 연결될 때 항상 데이터베이스가 초기화 됨
  logging: false, // 쿼리로그
};
