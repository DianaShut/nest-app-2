import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { Config, RedisConfig } from '../../configs/configs.type';
import { REDIS_CLIENT } from './redis.constants';
import { RedisService } from './redis.service';

//Провайдер створює клієнта Redis за допомогою конфігураційного сервісу.
const redisProvider: Provider = {
  useFactory: (configService: ConfigService<Config>): Redis => {
    const redisConfig = configService.get<RedisConfig>('redis'); //useFactory: Фабрична функція, яка створює та повертає новий екземпляр клієнта Redis.

    return new Redis({
      port: redisConfig.port,
      host: redisConfig.host,
      password: redisConfig.password,
    });
  },
  inject: [ConfigService], //Вказує на залежності, які потрібно інжектувати в фабричну функцію
  provide: REDIS_CLIENT, //Вказує на токен (константу), під яким цей провайдер буде доступний для інжекції (REDIS_CLIENT)
};

@Module({
  providers: [redisProvider, RedisService],
  exports: [redisProvider, RedisService],
})
export class RedisModule {}
