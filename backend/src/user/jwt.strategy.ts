import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import * as config from 'config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from './user.entity';

const jwtConfig = config.get('jwt');

// 다른곳에서도 주입해서 사용하기 위해
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    // 토큰이 유효한지 검사

    // secretOrKey - 유효한 토큰인지
    // jwtFormatRequest - 토큰위치
    super({
      secretOrKey: jwtConfig.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // 토큰이 유효한지 체크 후 DB에서 2차 체크
  // return 값은 @UseGuards(AuthGuard())를 이용한 모든 요청의 Request Object에 들어감
  async validate(payload) {
    const { username } = payload;
    const user: User = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    delete user.password;

    return user;
  }
}
