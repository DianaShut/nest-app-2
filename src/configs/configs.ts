import { Config } from './configs.type';

export default (): Config => ({
  app: {
    port: parseInt(process.env.APP_PORT) || 3000, // Порт додатку з файлу .env
    host: process.env.APP_HOST || '0.0.0.0',
  },
  database: {
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    dbName: process.env.POSTGRES_DB,
  },
  redis: {
    port: parseInt(process.env.REDIS_PORT) || 6379,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
    env: process.env.SENTRY_ENVIRONMENT,
    debug: process.env.SENTRY_DEBUG === 'true',
  },
});
