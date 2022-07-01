import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as config from 'config';
import { JwtStrategy } from './jwt.strategy';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

const jwtConfig = config.get('jwt');

@Module({
  imports: [
    // 인증을 위한 기본 strategy 명시
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    // jwt 인증 부분 담당
    JwtModule.register({
      secret: jwtConfig.secret,
    }),
    // 현재 범위(scope)에 레포지토리 등록, UsersService에 UsersRepository를 주입 가능
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService, JwtStrategy], // JwtStrategy가 Auth 모듈에서 사용 할 수 있게 등록
  controllers: [UserController],
  exports: [JwtStrategy, PassportModule], // 다른 모듈에서 사용 할 수 있게 등록
})
export class UserModule {}
