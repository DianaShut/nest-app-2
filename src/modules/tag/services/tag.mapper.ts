import { TagEntity } from '../../../database/entities/tag.entity';
import { TagResDto } from '../dto/res/tag.res.dto';

export class TagMapper {
  public static toResponseDTO(entity: TagEntity): TagResDto {
    return {
      name: entity.name,
      articlesCount: entity.articlesCount,
    };
  }
  public static toListResponseDTO(entities: TagEntity[]): TagResDto[] {
    return entities.map(this.toResponseDTO);
  }
}
