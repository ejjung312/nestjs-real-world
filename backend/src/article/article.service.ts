import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as slug from 'slug';
import { FollowsEntity } from 'src/profile/follows.entity';
import { User } from 'src/user/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Article } from './article.entity';
import { ArticleRO, ArticlesRO, CommentsRO } from './article.interface';
import { Comment } from './comment.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { CreateCommentDto } from './dto/create-comment';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FollowsEntity)
    private readonly followsRepository: Repository<FollowsEntity>,
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

  async findFeed(userId: number, query): Promise<ArticlesRO> {
    // 팔로잉 유저들 가져오기
    const _follows = await this.followsRepository.find({
      where: {
        followerId: userId,
      },
    });

    // 팔로잉 유저가 없다면
    if (!(Array.isArray(_follows) && _follows.length > 0)) {
      return { articles: [], articlesCount: 0 };
    }

    const ids = _follows.map((el) => el.followingId);

    const qb = await this.articleRepository
      .createQueryBuilder('article')
      .where('article.authorId IN (:ids)', { ids });

    qb.orderBy('article.created', 'DESC');

    const articlesCount = await qb.getCount();

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const articles = await qb.getMany();

    return { articles, articlesCount };
  }

  async findOne(where: object): Promise<ArticleRO> {
    const article = await this.articleRepository.findOne({ where });
    return { article };
  }

  async create(
    userId: number,
    articleData: CreateArticleDto,
  ): Promise<Article> {
    const article = new Article();
    article.title = articleData.title;
    article.description = articleData.description;
    article.slug = this.slugify(articleData.title);
    article.tagList = articleData.tagList || [];
    article.comments = [];

    const newArticle = await this.articleRepository.save(article);

    const author = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['articles'], // left join articles
    });
    author.articles.push(article);

    await this.userRepository.save(author);

    return newArticle;
  }

  async update(
    slug: string,
    articleData: CreateArticleDto,
  ): Promise<ArticleRO> {
    const toUpdate = await this.articleRepository.findOne({
      where: {
        slug,
      },
    });

    if (!toUpdate) {
      const errors = { slug: 'Can not find slug' };
      throw new HttpException(
        { message: 'Invalid slug', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    // toUpdate 객체에 articleData 업데이트 (복사)
    const updated = Object.assign(toUpdate, articleData);
    const article = await this.articleRepository.save(updated);
    return { article };
  }

  async delete(slug: string): Promise<DeleteResult> {
    return await this.articleRepository.delete({ slug });
  }

  async favorite(id: number, slug: string): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({
      where: {
        slug,
      },
    });

    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['favorites'], // left join favorites
    });

    // 기존에 좋아요 한 적이 없다면
    const isNewFavorite =
      user.favorites.findIndex((_article) => _article.id === article.id) < 0;

    if (isNewFavorite) {
      user.favorites.push(article);
      article.favoriteCount++;

      await this.userRepository.save(user);
      article = await this.articleRepository.save(article);
    }

    return { article };
  }

  async unFavorite(id: number, slug: string): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({
      where: {
        slug,
      },
    });

    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['favorites'], // left join favorites
    });

    const deleteIndex = user.favorites.findIndex(
      (_article) => _article.id === article.id,
    );

    if (deleteIndex >= 0) {
      user.favorites.splice(deleteIndex, 1);
      article.favoriteCount--;

      await this.userRepository.save(user);
      article = await this.articleRepository.save(article);
    }

    return { article };
  }

  async findComments(slug: string): Promise<CommentsRO> {
    const article = await this.articleRepository.findOne({
      where: {
        slug,
      },
    });

    return { comments: article.comments };
  }

  async addComment(
    slug: string,
    commentData: CreateCommentDto,
  ): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({
      where: {
        slug,
      },
    });

    const comment = new Comment();
    comment.body = commentData.body;

    article.comments.push(comment);

    await this.commentRepository.save(comment);
    article = await this.articleRepository.save(article);

    return { article };
  }

  async deleteComment(slug: string, id: number) {
    let article = await this.articleRepository.findOne({
      where: {
        slug,
      },
    });

    const comment = await this.commentRepository.findOne({
      where: {
        id,
      },
    });

    const deleteIndex = article.comments.findIndex(
      (_comment) => _comment.id === comment.id,
    );

    if (deleteIndex >= 0) {
      const deleteComments = article.comments.splice(deleteIndex, 1);
      await this.commentRepository.delete(deleteComments[0].id);
      article = await this.articleRepository.save(article);

      return { article };
    } else {
      return { article };
    }
  }

  slugify(title: string) {
    return (
      slug(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
