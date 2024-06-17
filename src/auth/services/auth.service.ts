import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RefreshTokenRepository } from '../../modules/repository/services/refresh-token.repository';
import { UserRepository } from '../../modules/repository/services/user.repository';
import { UserService } from '../../user/services/user.service';
import { SignInReqDto } from '../dto/req/sign-in.req.dto';
import { SignUpReqDto } from '../dto/req/sign-up.req.dto';
import { AuthResDto } from '../dto/res/auth.res.dto';
import { TokenPairResDto } from '../dto/res/token-pair.res.dto';
import { IUserData } from '../interfaces/user-data.interface';
import { AuthMapper } from './auth.mapper';
import { AuthCacheService } from './auth-cache.service';
import { TokenService } from './token.services';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  /**Реєстрація*/
  public async singUp(dto: SignUpReqDto): Promise<AuthResDto> {
    await this.userService.isEmailUniqueOrThrow(dto.email); //Перевірка унікальності email

    const password = await bcrypt.hash(dto.password, 10); //Хешування пароля
    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password }),
    ); //Зберігає нового користувача у базі даних.
    const pair = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
    }); //Генерує пару токенів
    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: user.id,
          refreshToken: pair.refreshToken,
          deviceId: dto.deviceId,
        }), //Збереження refresh токена
      ),
      this.authCacheService.saveToken(pair.accessToken, user.id, dto.deviceId), //Збереження access токена
    ]);
    return AuthMapper.toResponseDTO(user, pair);
  }

  /**Вхід*/
  public async singIn(dto: SignInReqDto): Promise<AuthResDto> {
    //Пошук користувача за email
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: { password: true, id: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    //Перевірка пароля за допомогою bcrypt
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    //Генерує пару токенів
    const pair = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: dto.deviceId,
        user_id: user.id,
      }),
      this.authCacheService.deleteToken(user.id, dto.deviceId),
    ]); //Видаляє старі токени з бази даних та кешу.

    //Збереження нових токенів
    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: user.id,
          refreshToken: pair.refreshToken,
          deviceId: dto.deviceId,
        }),
      ),
      this.authCacheService.saveToken(pair.accessToken, user.id, dto.deviceId),
    ]);
    const userEntity = await this.userRepository.findOneBy({ id: user.id });
    return AuthMapper.toResponseDTO(userEntity, pair); //Повернення даних користувача та токенів
  }

  public async refresh(userData: IUserData): Promise<TokenPairResDto> {
    //Видалення старих токенів
    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: userData.deviceId,
        user_id: userData.userId,
      }),
      this.authCacheService.deleteToken(userData.userId, userData.deviceId),
    ]);
    //Генерація нових токенів
    const pair = await this.tokenService.generateAuthTokens({
      userId: userData.userId,
      deviceId: userData.deviceId,
    });

    //Збереження нових токенів
    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: userData.userId,
          refreshToken: pair.refreshToken,
          deviceId: userData.deviceId,
        }),
      ),
      this.authCacheService.saveToken(
        pair.accessToken,
        userData.userId,
        userData.deviceId,
      ),
    ]);
    return AuthMapper.toResponseTokensDTO(pair);
  } //Повернення нової пари токенів

  //Видаляє токени з бази даних та кешу, щоб завершити сесію користувача.
  public async signOut(userData: IUserData): Promise<void> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: userData.deviceId,
        user_id: userData.userId,
      }),
      this.authCacheService.deleteToken(userData.userId, userData.deviceId),
    ]);
  }
}
