export type Config = {
  app: AppConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  sentry: SentryConfig;
}; // тип конфігурації додатку

export type AppConfig = {
  port: number;
  host: string;
};

export type DatabaseConfig = {
  port: number;
  host: string;
  user: string;
  password: string;
  dbName: string;
};

export type RedisConfig = {
  port: number;
  host: string;
  password: string;
};

export type SentryConfig = {
  dsn: string; // Data Source Name
  debug: boolean; // Режим налагодження (відладки) Sentry
  env: string; // Середовище виконання
};
