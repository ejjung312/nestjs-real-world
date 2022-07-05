import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { ArticlesRO } from './article.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(query): Promise<ArticlesRO> {
    const qb = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author');

    qb.where(' 1 = 1 ');

    // object에 tag key가 있는지
    if ('tag' in query) {
      qb.andWhere('article.tagList LIKE :tag', { tag: `%${query.tag}%` });
    }

    if ('author' in query) {
      const author = await this.userRepository.findOne({
        where: {
          username: query.author,
        },
      });
      qb.andWhere('article.authorId = :id', { id: author.id });
    }

    if ('favorited' in query) {
      const author = await this.userRepository.findOne({
        where: {
          username: query.favorited,
        },
      });
      const ids = author.favorites.map((el) => el.id); // ArticleEntity[] 에서 id만 뽑아서 배열 생성
      qb.andWhere('article.authorId IN (:ids)', { ids });
    }

    qb.orderBy('article.created', 'DESC');

    const articlesCount = await qb.getCount();

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const articles = await qb.getMany(); // 결과값

    return { articles, articlesCount };
  }
}
