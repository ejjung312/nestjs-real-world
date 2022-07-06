import { Article } from './article.entity';

export interface ArticleRO {
  article: Article;
}

export interface ArticlesRO {
  articles: Article[];
  articlesCount: number;
}
