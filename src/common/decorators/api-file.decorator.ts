import { applyDecorators } from '@nestjs/common'; // Функція яка дозволяє комбінувати декілька декораторів в один.
import { ApiBody } from '@nestjs/swagger'; // Декоратор який використовується для опису структури тіла HTTP запиту в документації Swagger.

//Кастомний декоратор ApiFile використовується для документування завантаження файлів у NestJS контролерах за допомогою Swagger. Декоратор дозволяє налаштовувати параметри завантаження файлів, такі як ім'я поля, чи є це поле масивом і чи є воно обов'язковим.

export const ApiFile = (
  fileName: string,
  isArray = true,
  isRequired = true,
): MethodDecorator => {
  //applyDecorators: Комбінує декоратори в один.
  return applyDecorators(
    ApiBody({
      //Визначає схему тіла запиту.
      schema: {
        type: 'object',
        required: isRequired ? [fileName] : [], //Якщо isRequired true, поле fileName додається до списку обов'язкових полів.
        properties: {
          //Динамічно визначає властивість об'єкта з ім'ям fileName.
          [fileName]: isArray
            ? {
                type: 'array',
                items: {
                  type: 'string',
                  format: 'binary',
                },
              }
            : {
                type: 'string',
                format: 'binary', //Формат елементів — двійкові дані (файл).
              },
        },
      },
    }),
  );
};
