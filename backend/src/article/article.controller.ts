import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { User } from 'src/user/user.decorator';
import { ArticleRO, ArticlesRO, CommentsRO } from './article.interface';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { CreateCommentDto } from './dto/create-comment';

@Controller('article')
@ApiTags('Article API')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @ApiOperation({
    summary: '게시물 API',
    description: '전체 게시물 가져오기 API',
  })
  @ApiOkResponse({ description: '전체 게시물을 조회한다.' })
  @ApiQuery({
    name: 'query',
    required: false,
    description: '조회 조건을 입력한다.',
  })
  async findAll(@Query() query): Promise<ArticlesRO> {
    return await this.articleService.findAll(query);
  }

  @Get('feed')
  async getFeed(
    @User('id') userId: number,
    @Query() query,
  ): Promise<ArticlesRO> {
    return await this.articleService.findFeed(userId, query);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<ArticleRO> {
    return await this.articleService.findOne({ slug });
  }

  @Post()
  async create(
    @User('id') userId: number,
    @Body('article') articleData: CreateArticleDto,
  ) {
    return this.articleService.create(userId, articleData);
  }

  @Put(':slug')
  async update(
    @Param() params,
    @Body('article') articleData: CreateArticleDto,
  ) {
    // TODO: update slug also when title gets changed
    return this.articleService.update(params.slug, articleData);
  }

  @Delete(':slug')
  async delete(@Param() params) {
    return this.articleService.delete(params.slug);
  }

  @Post(':slug/favorite')
  async favorite(@User('id') userId: number, @Param('slug') slug: string) {
    return await this.articleService.favorite(userId, slug);
  }

  @Delete(':slug/favorite')
  async unFavorite(@User('id') userId: number, @Param('slug') slug: string) {
    return await this.articleService.unFavorite(userId, slug);
  }

  @Get(':slug/comments')
  async findComments(@Param('slug') slug: string): Promise<CommentsRO> {
    return await this.articleService.findComments(slug);
  }

  @Post(':slug/comments')
  async createComment(
    @Param('slug') slug: string,
    @Body('comment') commentData: CreateCommentDto,
  ) {
    return await this.articleService.addComment(slug, commentData);
  }

  @Delete(':slug/comments/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async deleteComment(@Param() params: { slug: string; id: number }) {
    const { slug, id } = params;
    return await this.articleService.deleteComment(slug, id);
  }
}
