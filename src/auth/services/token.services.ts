import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { JwtService } from '@nestjs/jwt';

import { Config, JWTConfig } from '../../configs/configs.type';
import { TokenType } from '../enums/token-type.enum';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { ITokenPair } from '../interfaces/token-pair.interface';

@Injectable()
export class TokenService {
  private readonly jwtConfig: JWTConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.jwtConfig = configService.get<JWTConfig>('jwt');
  }

  //Цей метод приймає IJwtPayload, який представляє дані(userId, deviceId), що будуть збережені в JWT токені.
  public async generateAuthTokens(payload: IJwtPayload): Promise<ITokenPair> {
    //jwtService.signAsync() для генерації access та refresh токенів. Кожен токен підписується з використанням відповідного секретного ключа та терміну дії, отриманих з конфігурації JWT
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.accessSecret,
      expiresIn: this.jwtConfig.accessExpiresIn,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.refreshSecret,
      expiresIn: this.jwtConfig.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  //Перевірка достовірності токена шляхом перевірки підпису токена з використанням відповідного секретного ключа,
  public async verifyToken(
    token: string,
    type: TokenType,
  ): Promise<IJwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.getSecret(type),
      });
    } catch (error) {
      Logger.error('Token verification error', error);
      throw new UnauthorizedException();
    }
  }

  private getSecret(type: TokenType): string {
    let secret: string;
    switch (type) {
      case TokenType.ACCESS:
        secret = this.jwtConfig.accessSecret;
        break;
      case TokenType.REFRESH:
        secret = this.jwtConfig.refreshSecret;
        break;
      default:
        throw new Error('Unknown token type');
    }
    return secret;
  }
}
