import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from './article.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  // comment는 하나의 article을 가짐
  @ManyToOne((type) => Article, (article) => article.comments)
  article: Article;
}
