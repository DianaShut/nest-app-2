import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { ApiFile } from '../common/decorators/api-file.decorator';
import { UpdateUserReqDto } from './dto/req/update-user.req.dto';
import { UserResDto } from './dto/res/user.res.dto';
import { UserService } from './services/user.service';

@ApiTags('Users') // Додаємо тег Users для групування методів у документації Swagger
@Controller('users') // Базовий шлях для всіх методів контролера User
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Forbidden' }) // Додаємо в документацію відповідь з кодом 403(недостатньо прав доступу)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('me')
  public async getMe(@CurrentUser() userData: IUserData): Promise<UserResDto> {
    return await this.userService.getMe(userData);
  }

  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Put('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() dto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    return await this.userService.updateMe(userData, dto);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete('me')
  public async remove(
    @CurrentUser() userData: IUserData,
    @Param('id', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    return await this.userService.remove(userId);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseInterceptors(FileInterceptor('avatar')) //FileInterceptor налаштовує обробку файлів, де 'avatar' є назвою поля у формі, яке містить файл.
  @ApiConsumes('multipart/form-data') //Вказує, що цей маршрут приймає дані у форматі 'multipart/form-data', що є необхідним для завантаження файлів.
  @ApiFile('avatar', false) //Цей кастомний декоратор використовується для документування завантаження файлів через Swagger. 'avatar' - це назва поля, де false означає, що поле не є обов'язковим.
  @Post('me/avatar')
  public async uploadAvatar(
    @CurrentUser() userData: IUserData,
    @UploadedFile() avatar: Express.Multer.File, //Декоратор @UploadedFile витягує завантажений файл з запиту.
    //avatar - це змінна, яка буде містити завантажений файл. //Тип Express.Multer.File вказує, що це об'єкт файлу, оброблений Multer, який містить метадані файлу та його вміст.
  ): Promise<void> {
    await this.userService.uploadAvatar(userData, avatar);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete('me/avatar')
  public async deleteAvatar(@CurrentUser() userData: IUserData): Promise<void> {
    await this.userService.deleteAvatar(userData);
  }

  @SkipAuth()
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':userId')
  public async getById(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserResDto> {
    return await this.userService.getById(userId);
  }

  @ApiBearerAuth()
  @Post(':userId/follow')
  public async follow(
    @CurrentUser() userData: IUserData, //Декоратор, який отримує поточного користувача з запиту.
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    //Декоратор, який отримує параметр userId з URL і перетворює його на UUID.
    await this.userService.follow(userData, userId);
  }

  @ApiBearerAuth()
  @Delete(':userId/follow')
  public async unfollow(
    @CurrentUser() userData: IUserData,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    await this.userService.unfollow(userData, userId);
  }
}
