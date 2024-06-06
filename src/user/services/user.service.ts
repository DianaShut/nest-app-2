import { Injectable } from '@nestjs/common';

import { LoggerService } from '../modules/logger/logger.service';
import { UserRepository } from '../modules/repository/services/user.repository';
import { BaseUserReqDto } from './dto/req/base-user.req.dto';
import { UpdateUserReqDto } from './dto/req/update-user.req.dto';

@Injectable() // Декоратор, що вказує, що цей клас є сервісом
export class UserService {
  // private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly logger: LoggerService,
    private readonly userRepository: UserRepository,
  ) {}

  public async findAll(): Promise<any> {
    return `This action returns all user`;
  }

  public async findOne(id: string): Promise<any> {
    return `This action returns a #${id} user`;
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserReqDto,
  ): Promise<any> {
    return `This action updates a #${id} user`;
  }

  public async remove(id: string): Promise<any> {
    return `This action removes a #${id} user`;
  }

  public async isEmailUniqueOrThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('Email is already taken');
    }
  }
}
