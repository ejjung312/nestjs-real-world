import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRO } from './user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // 회원가입
  @Post()
  async create(@Body('user') userData: CreateUserDto): Promise<void> {
    return await this.userService.create(userData);
  }

  // 로그인
  @Post('/login')
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserRO> {
    // return this.userService.findOne(loginUserDto);
    const _user = await this.userService.findOne(loginUserDto);

    if (!_user) {
      const errors = { User: ' not found' };
      throw new HttpException({ errors }, HttpStatus.UNAUTHORIZED);
    }

    const token = await this.userService.generateJWT(_user);
    const { email, username, bio, image } = _user;
    const user = { email, token, username, bio, image };

    return { user };
  }
}
