import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRepository } from '../../modules/repository/services/user.repository';
import { SKIP_AUTH } from '../constants/constants';
import { TokenType } from '../enums/token-type.enum';
import { AuthMapper } from '../services/auth.mapper';
import { AuthCacheService } from '../services/auth-cache.service';
import { TokenService } from '../services/token.services';

@Injectable()
//JwtAccessGuard - це клас, який реалізує інтерфейс CanActivate. Він визначає логіку перевірки доступу до маршруту.
export class JwtAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private tokenService: TokenService,
    private authCacheService: AuthCacheService,
    private userRepository: UserRepository,
  ) {}

  // Метод canActivate є ключовою частиною Guard. Він викликається автоматично під час обробки запиту
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Спочатку перевіряється, чи потрібно пропускати авторизацію для поточного маршруту. Це визначається за допомогою Reflector, який зчитує метадані SKIP_AUTH з обробника маршруту або класу контролера.
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skipAuth) return true; //Якщо SKIP_AUTH встановлено, метод повертає true, і авторизація пропускається.

    //Якщо SKIP_AUTH не встановлено, Guard продовжує перевірку авторизації.
    //Спочатку з HTTP-запиту витягується access-токен, який передається в заголовку Authorization.
    const request = context.switchToHttp().getRequest();
    const accessToken = request.get('Authorization')?.split('Bearer ')[1];
    if (!accessToken) {
      throw new UnauthorizedException();
    }
    //Далі токен перевіряється на дійсність за допомогою TokenService.
    const payload = await this.tokenService.verifyToken(
      accessToken,
      TokenType.ACCESS,
    );
    if (!payload) {
      throw new UnauthorizedException();
    }

    //Потім перевіряється, чи access-токен зберігається в кеші AuthCacheService.
    const findTokenInRedis = await this.authCacheService.isAccessTokenExist(
      payload.userId,
      payload.deviceId,
      accessToken,
    );
    if (!findTokenInRedis) {
      throw new UnauthorizedException();
    }

    //Якщо всі перевірки пройшли успішно, користувач, пов'язаний з токеном, завантажується з бази даних за допомогою UserRepository.
    const user = await this.userRepository.findOneBy({
      id: payload.userId,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    request.user = AuthMapper.toUserDataDTO(user, payload.deviceId); //Об'єкт користувача перетворюється в DTO за допомогою AuthMapper і додається до об'єкта request
    return true; //Наприкінці метод повертає true, що дозволяє запиту пройти до обробника маршруту.
  }
}
