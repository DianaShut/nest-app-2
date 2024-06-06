import * as path from 'node:path';
import * as process from 'node:process';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'; // Імпорт інтерфейсів

import { Config, DatabaseConfig } from '../../configs/configs.type';

@Injectable()
export class PostgresConnectService implements TypeOrmOptionsFactory {
  // Конструктор, що приймає ConfigService для отримання конфігураційних параметрів
  constructor(private readonly configService: ConfigService<Config>) {}

  // Метод для створення параметрів підключення до бази даних
  createTypeOrmOptions(): TypeOrmModuleOptions {
    // Отримання конфігурації бази даних з ConfigService
    const databaseConfig = this.configService.get<DatabaseConfig>('database');
    // Повернення об'єкта з параметрами для підключення до PostgreSQL
    return {
      type: 'postgres',
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.user,
      password: databaseConfig.password,
      database: databaseConfig.dbName,
      // Шлях до файлів з визначеннями сутностей
      entities: [
        path.join(process.cwd(), 'dist', 'database', 'entities', '*.entity.js'),
      ],
      // Шлях до файлів з міграціями
      migrations: [
        path.join(process.cwd(), 'src', 'database', 'migrations', '*.ts'),
      ],
      synchronize: false, // Відключає автоматичне синхронізування схеми бази даних
      migrationsRun: true,
    };
  }
}
