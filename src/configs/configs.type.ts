export type Config = {
  app: AppConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
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
