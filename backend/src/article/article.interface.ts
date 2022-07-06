import { Article } from './article.entity';

interface Comment {
  body: string;
}

export interface CommentsRO {
  comments: Comment[];
}

export interface ArticleRO {
  article: Article;
}

export interface ArticlesRO {
  articles: Article[];
  articlesCount: number;
}
