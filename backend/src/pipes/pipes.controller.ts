import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ValidationPipe } from './validation.pipe';

// 파이프 사용 예제
@Controller('pipes')
export class PipesController {
  // ParseInt 사용
  @Get('test1/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log(id);
  }

  // 파이프 객체를 생성하여 객체의 동작을 원하는 대로 바꿈
  @Get('test2/:id')
  findTow(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    console.log(id);
  }

  // 인자값에 기본값을 설정
  @Get('test3')
  findThree(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    console.log(offset, limit);
  }

  // 커스텀 파이프
  @Post('test4')
  findFour(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    // metadata 출력 값 - { metatype: [class CreateUserDto], type: 'body', data: undefined }
    return;
  }

  // 커스텀 유효성 데코레이션
  @Post('test5')
  findFive(@Body('user') createUserDto: CreateUserDto) {
    console.log(createUserDto);

    return;
  }
}
