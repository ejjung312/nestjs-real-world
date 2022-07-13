import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseFilters
} from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

@Controller('exceptions')
// @UseFilters(HttpExceptionFilter) // 컨트롤러 전체에 적용
export class ExceptionsController {
  @UseFilters(HttpExceptionFilter) // 특정 엔드포인트에 적용
  @Get(':id')
  test1(@Param('id') id: number) {
    if (+id < 1) {
      throw new BadRequestException(
        'id는 0보다 큰 정수여야 합니다',
        'id format exception',
      );
    }
    return;
  }
}
