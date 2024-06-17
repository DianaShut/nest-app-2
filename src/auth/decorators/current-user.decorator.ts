import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//Декоратор, який можна використовувати у контролерах для отримання поточного автентифікованого користувача.
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
//createParamDecorator: Використовується для створення власного декоратора параметра.
// data: unknown: Додаткові дані, які можуть бути передані декоратору. У цьому випадку, він не використовується.
// ctx: ExecutionContext: Контекст виконання, який надає доступ до деталей поточного запиту.
//const request = ctx.switchToHttp().getRequest();
//Використовує метод switchToHttp() для перемикання контексту виконання на HTTP контекст та отримання об'єкта запиту.
//return request.user;
//Повертає властивість user з об'єкта запиту. Це передбачає, що об'єкт user був встановлений раніше, ймовірно, в процесі аутентифікації (наприклад, за допомогою Middleware або Guard).
