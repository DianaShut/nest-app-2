import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from './decorators/current-user.decorator';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { SignInReqDto } from './dto/req/sign-in.req.dto';
import { SignUpReqDto } from './dto/req/sign-up.req.dto';
import { AuthResDto } from './dto/res/auth.res.dto';
import { TokenPairResDto } from './dto/res/token-pair.res.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { IUserData } from './interfaces/user-data.interface';
import { AuthService } from './services/auth.service';

@ApiTags('Auth')
@Controller('auth') //Вказує, що цей клас є контролером, який обробляє маршрути, що починаються з /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**Реєстрація*/
  @SkipAuth() //Пропускає аутентифікацію для цього маршруту
  @ApiOperation({ summary: 'Sign up' }) //Додає опис операції для Swagger.
  @Post('sign-up') // Визначає маршрут POST /auth/sign-up
  public async singUp(@Body() dto: SignUpReqDto): Promise<AuthResDto> {
    return await this.authService.singUp(dto);
  } //Приймає дані користувача і повертає токени та дані користувача без пароля і deviceId

  /**Вхід*/
  @SkipAuth()
  @ApiOperation({ summary: 'Sign in' })
  @Post('sign-in')
  public async signIn(@Body() createAuthDto: SignInReqDto): Promise<any> {
    return await this.authService.singIn(createAuthDto);
  } //Приймає email, password і deviceId

  @SkipAuth() //Пропускає аутентифікацію через access token
  @ApiBearerAuth() //Вимагає refresh token
  @UseGuards(JwtRefreshGuard) //Використовує guard для перевірки refresh токена.
  @ApiOperation({ summary: 'Refresh token pair' })
  @Post('refresh')
  public async refresh(
    @CurrentUser() userData: IUserData,
  ): Promise<TokenPairResDto> {
    return await this.authService.refresh(userData);
  } //Приймає userId, email, deviceId і повертає пару токенів

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sign out' })
  @Post('sign-out')
  public async signOut(@CurrentUser() userData: IUserData): Promise<void> {
    return await this.authService.signOut(userData);
  } //Приймає userId, email, deviceId
}
