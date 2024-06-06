import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import { Config, SentryConfig } from '../../configs/configs.type';

@Injectable()
export class LoggerService {
  private isLocal: boolean; // Локальний режим відладки (true - локальний режим, false - продакшен)
  private readonly logger = new Logger(); // Логер для виведення повідомлень в консоль

  constructor(private readonly configService: ConfigService<Config>) {
    const sentryConfig = configService.get<SentryConfig>('sentry'); // Отримання конфігурації Sentry з ConfigService
    this.isLocal = sentryConfig.env === 'local'; // Визначення локального режиму відладки за змінною env

    Sentry.init({
      dsn: sentryConfig.dsn,
      debug: sentryConfig.debug,
      environment: sentryConfig.env,
      integrations: [
        nodeProfilingIntegration(), // Інтеграція з Sentry Profiler для аналізу продуктивності
        Sentry.anrIntegration({ captureStackTrace: true }), // Інтеграція з Sentry ANR для аналізу виключень
      ],
      tracesSampleRate: 1.0, // Відсоток відправлених трас для аналізу продуктивності
      profilesSampleRate: 1.0, // Відсоток відправлених профілів для аналізу продуктивності
    }); // Ініціалізація Sentry
  }

  public log(message: string): void {
    if (this.isLocal) {
      this.logger.log(message);
    } else {
      Sentry.captureMessage(message, 'log');
    }
  } // Метод для виведення повідомлення в консоль або відправлення його в Sentry

  public info(message: string): void {
    if (this.isLocal) {
      this.logger.log(message);
    } else {
      Sentry.captureMessage(message, 'info');
    }
  } // Метод для виведення інформаційного повідомлення в консоль або відправлення його в Sentry

  public warn(message: string): void {
    if (this.isLocal) {
      this.logger.log(message);
    } else {
      Sentry.captureMessage(message, 'warning');
    }
  }

  public error(error: any): void {
    if (this.isLocal) {
      this.logger.error(error, error.stack);
    } else {
      Sentry.captureException(error, { level: 'error' });
    }
  }
}
