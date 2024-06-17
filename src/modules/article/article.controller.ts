import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { ArticleListReqDto } from './dto/req/article-list.req.dto';
import { CreateArticleReqDto } from './dto/req/create-article.req.dto';
import { UpdateArticleReqDto } from './dto/req/update-article.req.dto';
import { ArticleResDto } from './dto/res/article.res.dto';
import { ArticleListResDto } from './dto/res/article-list.res.dto';
import { ArticleService } from './services/article.service';

@ApiBearerAuth()
@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiForbiddenResponse({ description: 'Forbidden' }) //користувач не має прав для доступу до ресурсу
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get()
  public async getList(
    @CurrentUser() userData: IUserData,
    @Query() query: ArticleListReqDto,
  ): Promise<ArticleListResDto> {
    return await this.articleService.getList(userData, query);
  } //@Query - декоратор, який витягує параметри запиту (query parameters) із запиту.

  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Post()
  public async create(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreateArticleReqDto,
  ): Promise<ArticleResDto> {
    return await this.articleService.create(userData, dto);
  } //@Body() dto: CreateArticleReqDto: Декоратор, який витягує тіло запиту (request body) і перетворює його на об'єкт типу CreateArticleReqDto.

  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':articleId')
  public async getById(
    @CurrentUser() userData: IUserData,
    @Param('articleId', ParseUUIDPipe) articleId: string,
  ): Promise<ArticleResDto> {
    return await this.articleService.getById(userData, articleId);
  } //@Param - декоратор, який витягує параметр articleId із URL.

  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Put(':articleId')
  public async updateById(
    @CurrentUser() userData: IUserData,
    @Param('articleId', ParseUUIDPipe) articleId: string,
    @Body() dto: UpdateArticleReqDto,
  ): Promise<ArticleResDto> {
    return await this.articleService.updateById(userData, articleId, dto);
  }

  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @HttpCode(HttpStatus.NO_CONTENT) //Вказує, що цей метод повинен повернути статус 204 (No Content) у разі успіху.
  @Delete(':articleId')
  public async deleteById(
    @CurrentUser() userData: IUserData,
    @Param('articleId', ParseUUIDPipe) articleId: string,
  ): Promise<void> {
    await this.articleService.deleteById(userData, articleId);
  }

  @ApiConflictResponse({ description: 'Conflict' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':articleId/like')
  public async like(
    @CurrentUser() userData: IUserData,
    @Param('articleId', ParseUUIDPipe) articleId: string,
  ): Promise<void> {
    await this.articleService.like(userData, articleId);
  }

  @ApiConflictResponse({ description: 'Conflict' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':articleId/like')
  public async unlike(
    @CurrentUser() userData: IUserData,
    @Param('articleId', ParseUUIDPipe) articleId: string,
  ): Promise<void> {
    await this.articleService.unlike(userData, articleId);
  }
}
