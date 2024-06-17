import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { RefreshTokenEntity } from '../../../database/entities/refresh-token.entity';

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshTokenEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(RefreshTokenEntity, dataSource.manager);
  }

  public async isTokenExist(refreshToken: string): Promise<boolean> {
    return await this.exists({ where: { refreshToken } });
  }
}

//Клас відповідає за роботу з таблицею RefreshTokenEntity в базі даних.
// Клас розширює Repository<RefreshTokenEntity>, що означає, що він успадковує всі методи для роботи з ентіті (збереження, оновлення, видалення, пошук тощо).
//Конструктор класу приймає dataSource і передає його менеджер в батьківський клас Repository.
// DataSource: Компонент TypeORM, який містить інформацію про з'єднання з базою даних і дозволяє виконувати запити.
// super(RefreshTokenEntity, dataSource.manager): Виклик конструктора батьківського класу Repository, який ініціалізує репозиторій з ентіті RefreshTokenEntity та менеджером джерела даних.
