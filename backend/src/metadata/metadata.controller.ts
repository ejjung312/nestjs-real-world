import { Controller, Get, UseGuards } from '@nestjs/common';
import { HandlerRolesGuard } from './handler-roles.guard';
import { Roles } from './roles.decorator';

@Controller('metadata')
// @Roles('admin') // 클래스에도 적용 가능
export class MetadataController {
  @Get()
  @UseGuards(HandlerRolesGuard)
  @Roles('admin')
  test1() {
    return;
  }
}
