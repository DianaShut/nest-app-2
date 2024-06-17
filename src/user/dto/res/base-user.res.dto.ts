import { ApiProperty } from '@nestjs/swagger';

//@ApiProperty - це декоратор, який дозволяє визначити властивості моделі, які будуть відображатися в документації Swagger. ApiProperty дозволяє визначити загальні властивості, такі як приклад, опис, обов'язковість, формат тощо.
export class BaseUserResDto {
  @ApiProperty({
    example: '121324354678976543fdg',
    description: 'The id of the User',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the User',
  })
  public readonly name: string;

  @ApiProperty({
    example: 'test@.gmail.com',
    description: 'The email of the User',
  })
  public readonly email: string;

  @ApiProperty({
    example: 'This is a bio',
    description: 'The bio of the User',
  })
  public readonly bio?: string;

  @ApiProperty({
    example: 'https://www.example.com/avatar.jpg',
    description: 'The avatar of the User',
  })
  public readonly image?: string;

  @ApiProperty({
    description: 'The date the User was created',
  })
  public readonly isFollowed?: boolean;
}
