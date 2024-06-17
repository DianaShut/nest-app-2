import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { GlobalExceptionFilter } from './common/http/global-exception.filter';
import configuration from './configs/configs';
import { ArticleModule } from './modules/article/article.module';
import { FileStorageModule } from './modules/file-storage/file-storage.module';
import { LoggerModule } from './modules/logger/logger.module';
import { PostgresModule } from './modules/postgres/postgres.module';
import { RepositoryModule } from './modules/repository/repository.module';
import { TagModule } from './modules/tag/tag.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }), // Підключення конфігурації
    RepositoryModule,
    LoggerModule,
    PostgresModule,
    UserModule,
    AuthModule,
    ArticleModule,
    TagModule,
    FileStorageModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    }, // Підключення глобального фільтра для обробки винятків
  ],
})
export class AppModule {}
