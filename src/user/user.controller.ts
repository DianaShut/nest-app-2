import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'; // Декоратори з NestJS для створення контролерів та методів
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'; // Декоратори з Swagger для документування API

import { CreateUserReqDto } from './dto/req/create-user.req.dto';
import { UpdateUserReqDto } from './dto/req/update-user.req.dto';
import { PrivateUserResDto } from './dto/res/private-user.res.dto';
import { PublicUserResDto } from './dto/res/public-user.res.dto';
import { UserService } from './user.service';

@ApiBearerAuth() // Додає в документацію вимогу авторизації через Bearer токен
@ApiTags('Users') // Додаємо тег Users для групування методів у документації Swagger
@Controller('users') // Базовий шлях для всіх методів контролера User
export class UserController {
  constructor(private readonly userService: UserService) {} // Внедрення UserService

  @ApiForbiddenResponse({ description: 'Forbidden' }) // Додаємо в документацію відповідь з кодом 403(недостатньо прав доступу)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' }) // Додаємо в документацію відповідь з кодом 401(не авторизовано)
  @ApiNotFoundResponse({ description: 'Not Found' }) // Додаємо в документацію відповідь з кодом 404(не знайдено)
  @Post() // Декоратор, який вказує, що цей метод обробляє POST запити
  public async create(
    @Body() dto: CreateUserReqDto, // Отримуємо дані для створення користувача з тіла запиту
  ): Promise<PrivateUserResDto> {
    // Повертаємо приватні дані користувача
    return await this.userService.create(dto); // Викликаємо метод create сервісу userService
  }

  //Метод для отримання користувача за id
  @ApiForbiddenResponse({ description: 'Forbidden' }) // Додаємо в документацію відповідь з кодом 403(недостатньо прав доступу)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':id') // Декоратор, який вказує, що цей метод обробляє GET запити
  public async findOne(@Param('id') id: string): Promise<PublicUserResDto> {
    // Отримуємо id користувача з параметрів запиту
    return await this.userService.findOne(id);
  }

  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Patch(':id')
  public async update(
    @Param('id') id: string, // Отримуємо id користувача з параметрів запиту
    @Body() updateUserDto: UpdateUserReqDto,
  ): Promise<any> {
    return await this.userService.update(id, updateUserDto);
  }

  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<any> {
    return await this.userService.remove(id);
  }
}
