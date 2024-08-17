import { IUserData } from '../../src/auth/interfaces/user-data.interface';
import { UserEntity } from '../../src/database/entities/user.entity';
import { UpdateUserReqDto } from '../../src/user/dto/req/update-user.req.dto';
import { UserResDto } from '../../src/user/dto/res/user.res.dto';

//Цей код представляє клас UserMock, який містить статичні методи для створення тестових даних користувача у вигляді різних об'єктів. Він використовується для імітації реальних даних під час написання тестів.

export class UserMock {
  //Статичний метод, який створює і повертає об'єкт типу IUserData. Опціонально приймає параметр properties, який дозволяє перекривати стандартні значення.
  static userData(properties?: Partial<IUserData>): IUserData {
    return {
      userId: 'testId',
      email: 'test@mail.com',
      deviceId: 'testDeviceId',
      ...(properties || {}), //дозволяє перекрити будь-яке з цих значень, якщо передані відповідні властивості
    };
  }

  static userEntity(properties?: Partial<UserEntity>): UserEntity {
    return {
      id: 'testId',
      email: 'test@mail.com',
      image: 'testImage',
      name: 'testName',
      password: 'testPassword',
      created: new Date('2021-01-01'),
      updated: new Date('2021-01-01'),
      bio: 'testBio',
      ...(properties || {}), //оператор розпакування для додавання або заміни властивостей, переданих у параметрі properties
    };
  }

  static updateUserReqDto(
    properties?: Partial<UpdateUserReqDto>,
  ): UpdateUserReqDto {
    return {
      name: 'testName',
      bio: 'testBio',
      ...(properties || {}),
    };
  }

  static toResponseDTO(properties?: Partial<UserResDto>): UserResDto {
    return {
      id: 'testId',
      email: 'test@mail.com',
      image: 'https://example-bucket-url.com/testImage',
      name: 'testName',
      bio: 'testBio',
      isFollowed: false,
      ...(properties || {}),
    };
  }
}
