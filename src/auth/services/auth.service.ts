import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { SignUpReqDto } from '../dto/req/sign-up.req.dto';
import { RefreshTokenRepository } from '../modules/repository/services/refresh-token.repository';
import { UserRepository } from '../modules/repository/services/user.repository';
import { UserService } from '../user/user.service';
import { AuthMapper } from './auth.mapper';
import { AuthCacheService } from './auth-cache.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async singUp(dto: SignUpReqDto): Promise<any> {
    await this.userService.isEmailUniqueOrThrow(dto.email);

    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password }),
    );
    const pair = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
    });
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
    return await AuthMapper.toResponseDTO(user, pair);
  }

  public async singIn(dto: any): Promise<any> {
    return 'This action adds a new auth';
  }
}
