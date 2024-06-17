import { Column, Entity, JoinTable, ManyToMany, VirtualColumn } from 'typeorm';

import { ArticleEntity } from './article.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';

@Entity({ name: TableNameEnum.TAGS })
export class TagEntity extends BaseModel {
  @Column('text')
  name: string;

  @ManyToMany(() => ArticleEntity, (entity) => entity.tags)
  @JoinTable()
  articles?: ArticleEntity[];

  @VirtualColumn({ query: () => 'NULL' }) //query: Функція, яка визначає, як це поле буде обчислюватися в запиті.
  articlesCount: number;
}
//Декоратор @VirtualColumn дозволяє додавати віртуальні колонки до сутностей в TypeORM, які не зберігаються в базі даних, але можуть бути обчислені під час виконання запиту. Це зручно для обчислення динамічних значень, таких як кількість пов'язаних записів або інші підрахунки, без необхідності зберігати ці значення в базі даних.

//() => 'NULL': У даному випадку, значення віртуальної колонки завжди буде NULL. Це може бути корисно, якщо ви плануєте замінити це значення в іншому місці коду або якщо хочете уникнути помилок у запиті, де очікується присутність цієї колонки.
