import { UserEntity } from '../../database/entities/user.entity';
import { UserMapper } from '../../user/services/user.mapper';
import { AuthResDto } from '../dto/res/auth.res.dto';
import { TokenPairResDto } from '../dto/res/token-pair.res.dto';
import { ITokenPair } from '../interfaces/token-pair.interface';
import { IUserData } from '../interfaces/user-data.interface';

//AuthMapper — це клас, що містить статичні методи для перетворення об'єктів між різними форматами (DTO - Data Transfer Object).

export class AuthMapper {
  public static toResponseDTO(
    user: UserEntity,
    tokenPair: ITokenPair,
  ): AuthResDto {
    return {
      tokens: this.toResponseTokensDTO(tokenPair),
      user: UserMapper.toResponseDTO(user),
    };
  }

  public static toResponseTokensDTO(tokenPair: ITokenPair): TokenPairResDto {
    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }

  public static toUserDataDTO(user: UserEntity, deviceId: string): IUserData {
    return {
      userId: user.id,
      email: user.email,
      deviceId,
    };
  }
}
