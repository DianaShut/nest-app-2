import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { RedisModule } from '../modules/redis/redis.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { AuthService } from './services/auth.service';
import { AuthCacheService } from './services/auth-cache.service';
import { TokenService } from './services/token.services';

@Module({
  imports: [JwtModule, RedisModule, UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    AuthCacheService,
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    }, //APP_GUARD - це спеціальна константа, яку NestJS використовує для визначення глобальних Guards.
    //Це означає, що JwtAccessGuard буде застосовуватися до всіх маршрутів у додатку і перевірятиме авторизацію користувача за допомогою JwtAccessGuard.
    JwtRefreshGuard,
  ],
})
export class AuthModule {}
