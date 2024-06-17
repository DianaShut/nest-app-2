import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { RefreshTokenRepository } from '../../modules/repository/services/refresh-token.repository';
import { UserRepository } from '../../modules/repository/services/user.repository';
import { TokenType } from '../enums/token-type.enum';
import { AuthMapper } from '../services/auth.mapper';
import { TokenService } from '../services/token.services';

@Injectable() // Робить цей клас провайдером, який можна інжектувати в інші класи.
export class JwtRefreshGuard implements CanActivate {
  //Інтерфейс, який визначає метод canActivate, що визначає, чи має користувач доступ до певного маршруту.
  constructor(
    private tokenService: TokenService,
    private refreshTokenRepository: RefreshTokenRepository,
    private userRepository: UserRepository,
  ) {}

  //ExecutionContext: Надає контекст виконання для поточного запиту.
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest(); //Отримує HTTP запит з контексту виконання.
    const refreshToken = request.get('Authorization')?.split('Bearer ')[1]; //Витягує refresh токен з заголовка Authorization
    if (!refreshToken) {
      throw new UnauthorizedException(); //викидання винятків у випадку неавторизованого доступу.
    }
    const payload = await this.tokenService.verifyToken(
      refreshToken,
      TokenType.REFRESH,
    );
    if (!payload) {
      throw new UnauthorizedException();
    }

    //Перевірка існування токена
    const isExist =
      await this.refreshTokenRepository.isTokenExist(refreshToken);
    if (!isExist) {
      throw new UnauthorizedException();
    }

    //Пошук користувача за userId, отриманим з payload
    const user = await this.userRepository.findOneBy({
      id: payload.userId,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    //Збереження даних користувача в запиті
    request.user = AuthMapper.toUserDataDTO(user, payload.deviceId); //Використовує AuthMapper для перетворення користувача
    return true; //Повернення значення true: Дозволяє доступ до захищеного маршруту.
  }
}
