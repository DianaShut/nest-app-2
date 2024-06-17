import { Injectable } from '@nestjs/common';

import { TagRepository } from '../../repository/services/tag.repository';
import { TagResDto } from '../dto/res/tag.res.dto';
import { TagMapper } from './tag.mapper';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  public async getPopular(): Promise<TagResDto[]> {
    const entities = await this.tagRepository.getPopular();
    return TagMapper.toListResponseDTO(entities);
  }
}
