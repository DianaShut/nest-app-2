import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis,
  ) {}

  /** Додавання елемента до множини*/
  public async addOneToSet(hash: string, value: string): Promise<number> {
    return await this.redisClient.sadd(hash, value);
  }
  //hash: Ім'я множини.
  // value: Значення, яке потрібно додати.
  // sadd: Команда Redis для додавання елемента до множини.

  /*** Видалення елемента*/
  public async remOneFromSet(key: string, setMember: string): Promise<number> {
    return await this.redisClient.srem(key, setMember);
  }
  //key: Ім'я множини.
  // setMember: Значення, яке потрібно видалити.
  // srem: Команда Redis для видалення елемента з множини.

  /** Видалення всіх записів за ключем*/
  public async deleteByKey(key: string): Promise<number> {
    return await this.redisClient.del(key);
  }
  //key: Ключ, за яким потрібно видалити записи.
  // del: Команда Redis для видалення ключа.

  /** Отримання всіх елементів множини*/
  public async sMembers(key: string): Promise<string[]> {
    return await this.redisClient.smembers(key);
  }
  //key: Ім'я множини.
  //smembers: Команда Redis для отримання всіх елементів множини.

  /**
   * Sets a timeout on a key.
   * After the timeout, the key will be automatically deleted.
   */
  public async expire(key: string, time: number): Promise<number> {
    return await this.redisClient.expire(key, time);
  }
  //key: Ключ, для якого встановлюється таймаут.
  // expire: Команда Redis для встановлення таймауту для ключа.
}
