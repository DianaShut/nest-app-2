import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';

import { IUserData } from '../../../auth/interfaces/user-data.interface';
import { ArticleEntity } from '../../../database/entities/article.entity';
import { TagEntity } from '../../../database/entities/tag.entity';
import { LoggerService } from '../../logger/logger.service';
import { ArticleRepository } from '../../repository/services/article.repository';
import { LikeRepository } from '../../repository/services/like.repository';
import { TagRepository } from '../../repository/services/tag.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { CreateArticleReqDto } from '../dto/req/create-article.req.dto';
import { UpdateArticleReqDto } from '../dto/req/update-article.req.dto';
import { ArticleResDto } from '../dto/res/article.res.dto';
import { ArticleMapper } from './article.mapper';

@Injectable()
export class ArticleService {
  constructor(
    private readonly logger: LoggerService,
    private readonly userRepository: UserRepository,
    private readonly likeRepository: LikeRepository,
    private readonly articleRepository: ArticleRepository,
    private readonly tagRepository: TagRepository,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}
  //entityManager інжектується з TypeORM для управління транзакціями.

  public async getList(userData: IUserData, query: any): Promise<any> {
    const [entities, total] = await this.articleRepository.getList(
      userData,
      query,
    );
    return ArticleMapper.toListResponseDTO(entities, total, query);
  } //Приймає IUserData: дані поточного користувача та query: any: параметри запиту для фільтрації та пагінації статей та повертає об'єкт з масивом статей (entities) та загальною кількістю статей (total).

  public async create(
    userData: IUserData,
    dto: CreateArticleReqDto,
  ): Promise<ArticleResDto> {
    //Передається асинхронна функція, яка отримує спеціальний екземпляр EntityManager (em) для виконання операцій у межах транзакції.
    return await this.entityManager.transaction('SERIALIZABLE', async (em) => {
      const articleRepository = em.getRepository(ArticleEntity); //щоб отримати репозиторій статей для виконання операцій з базою даних.
      const tags = await this.createTags(dto.tags, em); //
      const article = await articleRepository.save(
        this.articleRepository.create({
          ...dto,
          user_id: userData.userId,
          tags,
        }),
      );
      return ArticleMapper.toResponseDTO(article);
    });
  }

  private async createTags(
    tags: string[],
    em: EntityManager,
  ): Promise<TagEntity[]> {
    if (!tags || tags.length === 0) return [];

    const tagRepository = em.getRepository(TagEntity);
    const entities = await tagRepository.findBy({ name: In(tags) });
    const existingTags = new Set(entities.map((tag) => tag.name));
    const newTags = tags.filter((tag) => !existingTags.has(tag));

    const newEntities = await tagRepository.save(
      newTags.map((name) => tagRepository.create({ name })),
    );
    return [...entities, ...newEntities];
  }

  public async getById(
    userData: IUserData,
    articleId: string,
  ): Promise<ArticleResDto> {
    const article = await this.articleRepository.findArticleById(
      userData,
      articleId,
    );
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return ArticleMapper.toResponseDTO(article);
  }

  public async updateById(
    userData: IUserData,
    articleId: string,
    dto: UpdateArticleReqDto,
  ): Promise<ArticleResDto> {
    //Знаходить статтю, перевіряючи, що вона належить поточному користувачу.
    const article = await this.findMyArticleByIdOrThrow(
      userData.userId,
      articleId,
    );
    //Оновлює статтю в репозиторії articleRepository.
    await this.articleRepository.save({ ...article, ...dto });
    const updatedArticle = await this.articleRepository.findArticleById(
      userData,
      articleId,
    );
    //Повертає DTO відповіді оновленої статті, використовуючи ArticleMapper.
    return ArticleMapper.toResponseDTO(updatedArticle);
  }

  public async deleteById(
    userData: IUserData,
    articleId: string,
  ): Promise<void> {
    //Знаходить статтю, перевіряючи, що вона належить поточному користувачу.
    const article = await this.findMyArticleByIdOrThrow(
      userData.userId,
      articleId,
    );
    await this.articleRepository.remove(article);
  }

  public async findMyArticleByIdOrThrow(
    userId: string,
    articleId: string,
  ): Promise<ArticleEntity> {
    //Знаходить статтю за ID.
    const article = await this.articleRepository.findOneBy({
      id: articleId,
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    if (article.user_id !== userId) {
      throw new ForbiddenException();
    }
    return article;
  }

  public async like(userData: IUserData, articleId: string): Promise<void> {
    await this.findArticleByIdOrThrow(articleId);
    const like = await this.likeRepository.findOneBy({
      article_id: articleId,
      user_id: userData.userId,
    });
    if (like) {
      throw new ConflictException('Already liked');
    }
    await this.likeRepository.save(
      this.likeRepository.create({
        article_id: articleId,
        user_id: userData.userId,
      }),
    );
  }

  public async unlike(userData: IUserData, articleId: string): Promise<void> {
    await this.findArticleByIdOrThrow(articleId);
    const like = await this.likeRepository.findOneBy({
      article_id: articleId,
      user_id: userData.userId,
    });
    if (!like) {
      throw new ConflictException('Not liked yet');
    }
    await this.likeRepository.remove(like);
  }

  private async findArticleByIdOrThrow(
    articleId: string,
  ): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOneBy({ id: articleId });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }
}
