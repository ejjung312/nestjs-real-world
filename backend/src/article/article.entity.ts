import { User } from 'src/user/user.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Comment } from './comment.entity';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }

  /*
    일반 array 값을 넣을 수 있는 타입
    DB에 배열의 값이 들어감
    DB에서 불러올 때는 배열의 값으로 리턴됨
  */
  @Column('simple-array')
  tagList: string[];

  // User(1) : Article(N)
  @ManyToOne((type) => User, (user) => user.articles)
  author: User;

  // article은 여러개의 comment를 가짐
  // 타겟엔티티, 관계지정, 하위 엔티티까지 가져옴
  @OneToMany((type) => Comment, (comment) => comment.article, { eager: true })
  @JoinColumn()
  comments: Comment[];

  @Column({ default: 0 })
  favoriteCount: number;
}
