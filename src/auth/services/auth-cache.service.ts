import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';

import { Config, JWTConfig } from '../../configs/configs.type';
import { RedisService } from '../../modules/redis/redis.service';

@Injectable()
export class AuthCacheService {
  private jwtConfig: JWTConfig;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.jwtConfig = this.configService.get('jwt');
  }

  public async saveToken(
    token: string,
    userId: string,
    deviceId: string,
  ): Promise<void> {
    const key = `ACCESS_TOKEN:${userId}:${deviceId}`; // формує ключ для Redis

    //Спочатку метод видаляє попередній запис за цим ключем, якщо він існує.
    await this.redisService.deleteByKey(key);
    //Потім метод додає новий токен до Redis-множини, пов'язаної з ключем.
    await this.redisService.addOneToSet(key, token);
    //Наприкінці метод встановлює термін дії запису в Redis, відповідно до налаштувань JWT, отриманих з конфігурації.
    await this.redisService.expire(key, this.jwtConfig.accessExpiresIn);
  }

  public async isAccessTokenExist(
    userId: string,
    deviceId: string,
    token: string,
  ): Promise<boolean> {
    const key = this.getKey(userId, deviceId);
    //Метод отримує всі токени, збережені в Redis-множині за цим ключем.
    const set = await this.redisService.sMembers(key);
    //I перевіряє, чи присутній у ньому наданий токен.
    return set.includes(token); //повертає true або false
  }
  public async deleteToken(userId: string, deviceId: string): Promise<void> {
    const key = this.getKey(userId, deviceId);
    await this.redisService.deleteByKey(key);
  }

  private getKey(userId: string, deviceId: string): string {
    return `ACCESS_TOKEN:${userId}:${deviceId}`;
  }
}
