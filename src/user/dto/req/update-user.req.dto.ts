import { PickType } from '@nestjs/swagger';

import { BaseUserReqDto } from './base-user.req.dto';

export class UpdateUserReqDto extends PickType(BaseUserReqDto, [
  'bio',
  'image',
  'name',
]) {}
