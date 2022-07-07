import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModule } from './article/article.module';
import { typeOrmConfig } from './configs/typeorm.config';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    ProfileModule,
    ArticleModule,
    TagModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  // constructor(private dataSource: DataSource) {}
}
