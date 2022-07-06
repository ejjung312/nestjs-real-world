import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';
import { Article } from 'src/article/article.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  image: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(this.password, salt);

      this.password = hashedPassword;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  /* 
    ManyToMany
    - 엔티티 간 관계 설정
    - junction table (두 엔티티 간 관계 테이블) 생성됨

    JoinTable
    - N:M 관계에서 소유자 측을 지정하는데 사용
  */
  @ManyToMany((type) => Article)
  @JoinTable()
  favorites: Article[];

  // 하나의 user는 여러개의 article을 가짐
  @OneToMany((type) => Article, (article) => article.author)
  articles: Article[];
}
