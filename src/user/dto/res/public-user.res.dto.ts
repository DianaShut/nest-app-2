import { PickType } from '@nestjs/swagger'; // Для вибору властивостей з іншого класу. PickType є генератором типів, який створює новий тип, вибравши певні властивості з існуючого типу.

import { BaseUserResDto } from './base-user.res.dto';

export class PublicUserResDto extends PickType(BaseUserResDto, [
  'id',
  'name',
  'age',
  'avatar',
]) {}
