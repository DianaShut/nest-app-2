import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AppConfig } from './configs/configs.type';

// Створюємо асинхронну функцію bootstrap для запуску додатку
async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Create a new Nest application

  const configService = app.get(ConfigService); // Отримуємо сервіс конфігурації
  const appConfig = configService.get<AppConfig>('app'); // Отримуємо конфігурацію додатку

  const config = new DocumentBuilder() // Створюємо новий об'єкт DocumentBuilder, який дозволяє налаштувати документацію Swagger
    .setTitle('Example')
    .setDescription('The cats API description') // Встановлюємо заголовок та опис документації
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    }) //
    .build(); // Викликаємо метод build() для створення об'єкта config
  const document = SwaggerModule.createDocument(app, config); // Створюємо документацію Swagger за допомогою методу createDocument
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'list', // list - розгортання всіх моделей, none - не розгортати моделі, full - розгортати всі моделі
      defaultModelsExpandDepth: 2, // Глибина розгортання моделей за замовчуванням
      persistAuthorization: true, // Зберігати авторизацію при перезавантаженні сторінки
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Автоматично перетворювати вхідні дані на відповідний тип
      whitelist: true, // Видаляти зайві властивості з об'єктів
      forbidNonWhitelisted: true, // Викидати помилку, якщо властивість не відповідає схемі
    }),
  ); // Встановлюємо глобальний обробник ValidationPipe для перевірки вхідних даних

  await app.listen(appConfig.port, appConfig.host, () => {
    console.log(`Server running on http://${appConfig.host}:${appConfig.port}`);
    console.log(
      `Swagger running on http://${appConfig.host}:${appConfig.port}/docs`,
    );
  });
}
void bootstrap();
