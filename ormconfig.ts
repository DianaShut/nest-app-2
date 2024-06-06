import * as path from 'node:path';

import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import getter from './src/configs/configs'; // Імпорт функції для отримання конфігурації

dotenv.config({ path: './environments/local.env' }); // Завантаження змінних середовища з файлу .env

const databaseConfig = getter().database; // Отримання конфігурації бази даних з функції getter

export default new DataSource({
  type: 'postgres',
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.dbName,
  entities: [
    path.join(process.cwd(), 'src', 'database', 'entities', '*.entity.ts'),
  ],
  migrations: [
    path.join(process.cwd(), 'src', 'database', 'migrations', '*.ts'),
  ],
  synchronize: false,
});
