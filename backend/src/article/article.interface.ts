import { Article } from './article.entity';

export interface ArticlesRO {
  articles: Article[];
  articlesCount: number;
}
