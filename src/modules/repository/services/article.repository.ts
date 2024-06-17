import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { IUserData } from '../../../auth/interfaces/user-data.interface';
import { ArticleEntity } from '../../../database/entities/article.entity';
import { ArticleListReqDto } from '../../article/dto/req/article-list.req.dto';

@Injectable() //Декоратор, що позначає клас ArticleRepository як сервіс (провайдер), який може бути інжектований в інші частини застосунку NestJS.
export class ArticleRepository extends Repository<ArticleEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ArticleEntity, dataSource.manager);
  }
  public async getList(
    userData: IUserData,
    query: ArticleListReqDto,
  ): Promise<[ArticleEntity[], number]> {
    const qb = this.createQueryBuilder('article'); //Створює запит з назвою таблиці article.
    qb.leftJoinAndSelect('article.likes', 'like', 'like.user_id = :myId');
    qb.leftJoinAndSelect('article.tags', 'tag'); //Ліве приєднання таблиці tags до article.
    qb.leftJoinAndSelect('article.user', 'user'); //Ліве приєднання таблиці user до article.
    qb.leftJoinAndSelect(
      'user.followings',
      'follow',
      'follow.follower_id = :myId',
    ); //Ліве приєднання таблиці followings до user, з умовою follow.follower_id = :myId.
    qb.setParameter('myId', userData.userId); //Встановлює параметр myId рівним userData.userId.

    //Якщо запит містить тег, додає умову до запиту.
    if (query.tag) {
      qb.andWhere('tag.name = :tag');
      qb.setParameter('tag', query.tag);
    }

    //Якщо запит містить строку пошуку, додає умову до запиту.
    //перевіряє, чи містить об'єкт query параметр search.
    if (query.search) {
      qb.andWhere(
        'CONCAT(LOWER(article.title), LOWER(article.description), LOWER(article.body)) LIKE :search',
      );
      //CONCAT: Функція SQL, яка об'єднує (конкатенує) декілька рядків в один.
      // LOWER: Функція SQL, яка перетворює всі символи рядка в нижній регістр. Це робиться для того, щоб пошук був нечутливим до регістру.
      // article.title, article.description, article.body: Поля з таблиці article.
      // LIKE :search: Використання оператора LIKE для пошуку підрядка в об'єднаному тексті. :search є параметром, значення якого буде встановлено пізніше.

      //Метод setParameter встановлює значення для параметра search в запиті.
      qb.setParameter('search', `%${query.search}%`);
    }
    //%${query.search}%: Значення параметра. Знак % в SQL використовується як підстановочний знак, що відповідає нульовій або більше кількості будь-яких символів. Тому вираз %${query.search}% означає, що ми шукаємо будь-який текст, який містить query.search як підрядок.

    qb.orderBy('article.created', 'DESC'); //Встановлює порядок сортування за датою створення.
    qb.take(query.limit); //Встановлює обмеження на кількість результатів.
    qb.skip(query.offset); //Встановлює зсув для пагінації.

    return await qb.getManyAndCount(); // Виконує запит і повертає масив статей та їхню кількість.
  }

  public async findArticleById(
    userData: IUserData,
    articleId: string,
  ): Promise<ArticleEntity> {
    const qb = this.createQueryBuilder('article'); //Створює запит з назвою таблиці article.
    qb.leftJoinAndSelect('article.likes', 'like', 'like.user_id = :myId');
    qb.leftJoinAndSelect('article.tags', 'tag'); //Ліве приєднання таблиці tags до article.
    qb.leftJoinAndSelect('article.user', 'user'); //Ліве приєднання таблиці user до article.
    qb.leftJoinAndSelect(
      'user.followings',
      'follow',
      'follow.follower_id = :myId',
    ); //Ліве приєднання таблиці followings до user, з умовою follow.follower_id = :myId.

    qb.where('article.id = :articleId'); //Додає умову до запиту, щоб знайти статтю за її ID.
    qb.setParameter('articleId', articleId); //Встановлює параметр articleId.
    qb.setParameter('myId', userData.userId); //Встановлює параметр myId.

    return await qb.getOne(); //Виконує запит і повертає одну статтю.
  }
}

//constructor(private readonly dataSource: DataSource): Конструктор класу, який приймає об'єкт DataSource. Цей об'єкт відповідає за підключення до бази даних та надає менеджера транзакцій.
// super(ArticleEntity, dataSource.manager): Виклик конструктора базового класу Repository з передачею сутності ArticleEntity та менеджера транзакцій з dataSource. Це забезпечує налаштування репозиторію для роботи з конкретною сутністю та відповідним менеджером транзакцій.
