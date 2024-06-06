import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ArticleEntity } from '../../../database/entities/article.entity';

@Injectable() //Декоратор, що позначає клас ArticleRepository як сервіс (провайдер), який може бути інжектований в інші частини застосунку NestJS.
export class ArticleRepository extends Repository<ArticleEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ArticleEntity, dataSource.manager);
  }
}

//constructor(private readonly dataSource: DataSource): Конструктор класу, який приймає об'єкт DataSource. Цей об'єкт відповідає за підключення до бази даних та надає менеджера транзакцій.
// super(ArticleEntity, dataSource.manager): Виклик конструктора базового класу Repository з передачею сутності ArticleEntity та менеджера транзакцій з dataSource. Це забезпечує налаштування репозиторію для роботи з конкретною сутністю та відповідним менеджером транзакцій.
