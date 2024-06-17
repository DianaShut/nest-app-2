import { ArticleEntity } from '../../../database/entities/article.entity';
import { UserMapper } from '../../../user/services/user.mapper';
import { ArticleListReqDto } from '../dto/req/article-list.req.dto';
import { ArticleResDto } from '../dto/res/article.res.dto';
import { ArticleListResDto } from '../dto/res/article-list.res.dto';

export class ArticleMapper {
  public static toResponseDTO(entity: ArticleEntity): ArticleResDto {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      body: entity.body,
      created: entity.created,
      updated: entity.updated,
      isLiked: entity.likes?.length > 0,
      tags: entity.tags ? entity.tags.map((tag) => tag.name) : [],
      user: entity.user ? UserMapper.toResponseDTO(entity.user) : null,
    };
  }
  public static toListResponseDTO(
    entities: ArticleEntity[],
    total: number,
    query: ArticleListReqDto,
  ): ArticleListResDto {
    return {
      data: entities.map(this.toResponseDTO),
      meta: {
        total,
        limit: query.limit,
        offset: query.offset,
      },
    };
  }
}
