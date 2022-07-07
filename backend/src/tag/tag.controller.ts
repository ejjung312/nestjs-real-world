import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagEntity } from './tag.entity';
import { TagService } from './tag.service';

@Controller('tag')
@ApiTags('Tag API')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({
    summary: 'Tag 전체 정보 API',
    description: 'Tag 전체 정보',
  })
  @ApiOkResponse({
    description: 'Tag 전체 정보를 얻는다.',
    type: TagEntity,
  })
  async findAll(): Promise<TagEntity[]> {
    return await this.tagService.findAll();
  }
}
