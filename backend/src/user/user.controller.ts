import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './user.decorator';
import { UserRO } from './user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // 토큰에서 회원정보 가져오기
  @Get()
  @UseGuards(AuthGuard())
  async findMe(@User('email') email: string): Promise<UserRO> {
    return await this.userService.findByEmail(email);
  }

  // 회원가입
  @UsePipes(new ValidationPipe()) // validation 사용 명시
  @Post()
  async create(@Body('user') userData: CreateUserDto): Promise<void> {
    return await this.userService.create(userData);
  }

  // 로그인
  @UsePipes(new ValidationPipe()) // validation 사용 명시
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
