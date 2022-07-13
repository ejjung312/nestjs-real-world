import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  LoggerService,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.decorator';
import { UserRO } from './user.interface';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User API')
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService, // 전역로거
  ) {}

  // 토큰에서 회원정보 가져오기
  @Get()
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: '로그인 한 User 정보 API',
    description: '로그인 한 User 정보',
  })
  @ApiOkResponse({ description: '로그인 한 User 정보를 얻는다.' })
  async findMe(@User('email') email: string): Promise<UserRO> {
    return await this.userService.findByEmail(email);
  }

  // 회원 업데이트
  @Put()
  @ApiOperation({
    summary: 'User 정보 업데이트 API',
    description: 'User 정보 업데이트',
  })
  @ApiOkResponse({
    description: 'User 정보를 업데이트한다.',
    type: UpdateUserDto,
  })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @User('id') userId: number,
    @Body('user') userData: UpdateUserDto,
  ) {
    return await this.userService.update(userId, userData);
  }

  @Delete('/:slug')
  @ApiOperation({ summary: 'User 삭제 API', description: 'User 삭제' })
  @ApiOkResponse({ description: 'User를 삭제한다.' })
  @ApiParam({
    name: 'slug',
    required: true,
    description: '삭제 할 User 이메일',
  })
  async delete(@Param() params) {
    // params에 slug key로 값이 들어옴 -> { slug: 'ej@gmail.com' }
    return await this.userService.delete(params.slug);
  }

  // 회원가입
  @Post()
  @UsePipes(new ValidationPipe()) // validation 사용 명시
  @ApiOperation({ summary: 'User 생성 API', description: 'User 생성' })
  @ApiCreatedResponse({ description: 'User를 생성한다.', type: CreateUserDto })
  @ApiBody({ type: CreateUserDto })
  async create(@Body('user') userData: CreateUserDto): Promise<void> {
    this.printLoggerServiceLog(userData);
    return await this.userService.create(userData);
  }

  // 로그인
  @Post('/login')
  @UsePipes(new ValidationPipe()) // validation 사용 명시
  @ApiOperation({ summary: 'User 로그인 API', description: 'User 로그인' })
  @ApiOkResponse({ description: 'User를 로그인시킨다.', type: LoginUserDto })
  @ApiBody({ type: LoginUserDto })
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

  ////////////////////////////////////
  // 전역로거
  private printLoggerServiceLog(dto) {
    try {
      throw new InternalServerErrorException('test');
    } catch (error) {
      this.logger.error('error: ' + JSON.stringify(dto), error.stack);
    }

    this.logger.warn('warn: ' + JSON.stringify(dto));
    this.logger.log('log: ' + JSON.stringify(dto));
    this.logger.verbose('verbose: ' + JSON.stringify(dto));
    this.logger.debug('debug: ' + JSON.stringify(dto));
  }
}
