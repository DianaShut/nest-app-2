import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { IUserData } from '../../auth/interfaces/user-data.interface';
import { ContentType } from '../../modules/file-storage/models/enums/content-type.enum';
import { FileStorageService } from '../../modules/file-storage/services/file-storage.service';
import { LoggerService } from '../../modules/logger/logger.service';
import { FollowRepository } from '../../modules/repository/services/follow.repository';
import { UserRepository } from '../../modules/repository/services/user.repository';
import { UpdateUserReqDto } from '../dto/req/update-user.req.dto';
import { UserResDto } from '../dto/res/user.res.dto';
import { UserMapper } from './user.mapper';

@Injectable() // Декоратор, що вказує, що цей клас є сервісом
export class UserService {
  // private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly logger: LoggerService,
    private readonly userRepository: UserRepository,
    private readonly followRepository: FollowRepository,
    private readonly fileStorageService: FileStorageService,
  ) {}

  public async getMe(userData: IUserData): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    return UserMapper.toResponseDTO(user);
  }

  public async updateMe(
    userData: IUserData,
    dto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    const updatedUser = await this.userRepository.save({ ...user, ...dto });
    return UserMapper.toResponseDTO(updatedUser);
  }

  public async getById(userId: string): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return UserMapper.toResponseDTO(user);
  }

  public async remove(userId: string): Promise<void> {}

  //Приймає дані поточного користувача та ID користувача, якого потрібно підписати.
  public async follow(userData: IUserData, userId: string): Promise<void> {
    //Перевіряє, чи не намагається користувач підписатися на самого себе.
    if (userData.userId === userId) {
      throw new ConflictException('You cannot follow yourself');
    }
    //Перевіряє, чи існує користувач з таким ID.
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    //Перевіряє, чи вже підписаний користувач на цього користувача.
    const follow = await this.followRepository.findOneBy({
      follower_id: userData.userId,
      following_id: userId,
    });
    if (follow) {
      throw new ConflictException('You are already following this user');
    }
    //Зберігає новий запис у базі даних, який вказує, що користувач підписався на іншого користувача.
    await this.followRepository.save(
      this.followRepository.create({
        follower_id: userData.userId,
        following_id: userId,
      }),
    );
  }

  //Приймає дані поточного користувача та ID користувача, від якого потрібно відписатися.
  public async unfollow(userData: IUserData, userId: string): Promise<void> {
    //Перевіряє, чи не намагається користувач відписатися від самого себе.
    if (userData.userId === userId) {
      throw new ConflictException('You cannot follow yourself');
    }
    //Перевіряє, чи існує користувач з таким ID.
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    //Перевіряє, чи дійсно користувач підписаний на цього користувача.
    const follow = await this.followRepository.findOneBy({
      follower_id: userData.userId,
      following_id: userId,
    });
    if (!follow) {
      throw new ConflictException('You cant unfollow this user');
    }
    //Видаляє запис у базі даних, який вказує, що користувач підписався на іншого користувача.
    await this.followRepository.remove(follow);
  }

  public async isEmailUniqueOrThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('Email is already taken');
    }
  }

  public async uploadAvatar(
    userData: IUserData,
    avatar: Express.Multer.File,
  ): Promise<void> {
    const image = await this.fileStorageService.uploadFile(
      avatar,
      ContentType.AVATAR,
      userData.userId,
    );
    await this.userRepository.update(userData.userId, { image });
  }

  public async deleteAvatar(userData: IUserData): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId }); //Репозиторій: userRepository є репозиторієм, який працює з сутністю UserEntity. Це означає, що всі методи цього репозиторію повертають об'єкти типу UserEntity.
    if (user.image) {
      await this.fileStorageService.deleteFile(user.image);
      await this.userRepository.save(
        this.userRepository.merge(user, { image: null }),
      );
    }
  }
}
