import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowsEntity } from 'src/profile/follows.entity';
import { User } from 'src/user/user.entity';
import { ArticleController } from './article.controller';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { Comment } from './comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User, Comment, FollowsEntity])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
