import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { LoggerService } from '../../modules/logger/logger.service'; // Імпортується сервіс LoggerService, який використовується для логування помилок.

@Catch() // Декоратор, який вказує, що клас є фільтром винятків. Він буде перехоплювати всі виключення, які виникають у додатку.
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {} // В конструкторі класу відбувається ініціалізація сервісу LoggerService.

  //Метод, який викликається, коли виникає виключення. Він приймає виключення та об'єкт ArgumentsHost, який містить контекст, в якому виникло виключення.
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // Отримання контексту виконання запиту з ArgumentsHost.
    const response = ctx.getResponse<Response>(); // Отримання об'єкту відповіді з контексту виконання запиту.
    const request = ctx.getRequest<Request>(); // Отримання об'єкту запиту з контексту виконання запиту.

    let status: number;
    let messages: string | string[];

    //Перевірка, чи є виключення екземпляром HttpException. Якщо так, використовуються статус та повідомлення з виключення. Якщо ні, встановлюється статус 500 та загальне повідомлення про помилку.
    if (exception instanceof HttpException) {
      messages = (exception as HttpException).message;
      status = exception.getStatus();
    } else {
      status = 500;
      messages = 'Internal server error';
    }
    this.logger.error(exception); // Логування виключення за допомогою сервісу LoggerService.

    messages = Array.isArray(messages) ? messages : [messages]; // Перетворення повідомлень про помилку на масив, якщо вони не є масивом.

    response.status(status).json({
      statusCode: status,
      messages,
      timestamp: new Date().toISOString(),
      path: request.url,
    }); //Відправлення відповіді з відповідним статусом та JSON-тілом, яке містить статус, повідомлення, часову мітку та шлях запиту.
  }
}
