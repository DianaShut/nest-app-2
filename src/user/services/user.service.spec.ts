import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { UserMock } from '../../../test/__mocks__/user.mock';
import { FileStorageService } from '../../modules/file-storage/services/file-storage.service';
import { LoggerService } from '../../modules/logger/logger.service';
import { FollowRepository } from '../../modules/repository/services/follow.repository';
import { UserRepository } from '../../modules/repository/services/user.repository';
import { mockUserProviders } from '../__mocks__/user.module';
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';

//describe: Ця функція визначає блок тестів. Назва блоку вказує, що цей блок тестує UserService.
describe(UserService.name, () => {
  //оголошуємо змінні для сервісу UserService та його залежностей. Це дозволяє використовувати їх в тестах.
  let service: UserService;
  let mockLoggerService: LoggerService;
  let mockUserRepository: UserRepository;
  let mockFollowRepository: FollowRepository;
  let mockFileStorageService: FileStorageService;

  //Ця функція виконується перед кожним тестом. Тут ми створюємо тестовий модуль за допомогою Test.createTestingModule. Він надає всі необхідні залежності (providers) для тестування UserService.
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [...mockUserProviders, UserService],
    }).compile();
    service = module.get<UserService>(UserService);

    //module.get: Використовується для отримання інстансів сервісів, які ми будемо тестувати та імітувати.
    mockLoggerService = module.get<LoggerService>(LoggerService);
    mockUserRepository = module.get<UserRepository>(UserRepository);
    mockFollowRepository = module.get<FollowRepository>(FollowRepository);
    mockFileStorageService = module.get<FileStorageService>(FileStorageService);
  });

  //afterEach: Ця функція виконується після кожного тесту. Вона скидає всі імітовані функції, щоб уникнути впливу попередніх тестів на наступні.
  afterEach(() => {
    jest.resetAllMocks();
  });

  //it: Це окремий тестовий випадок. Тут ми перевіряємо, чи був сервіс UserService правильно ініціалізований.
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //Визначає блок тестів для методу getMe.
  describe('getMe', () => {
    it('should return user', async () => {
      const userData = UserMock.userData();
      const resDto = UserMock.toResponseDTO();
      const userEntity = UserMock.userEntity(); //Створює моковий об'єкт користувача для перевірки.

      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(userEntity); //Імітує метод findOneBy репозиторію UserRepository, налаштовуючи його на повернення певного значення (userEntity).
      jest.spyOn(UserMapper, 'toResponseDTO').mockReturnValue(resDto); //Імітує метод toResponseDTO з UserMapper, який перетворює сутність користувача у DTO.

      //Перевіряє, чи повернене значення (result) відповідає очікуваному DTO (resDto).
      const result = await service.getMe(userData);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        id: userData.userId,
      });
      expect(result).toEqual(resDto);
      expect(result.id).toBe(resDto.id);
    });
  });

  //Перевіряє, чи метод оновлення користувача правильно працює та повертає оновлений DTO.
  describe('updateMe', () => {
    it('should return updated user', async () => {
      const userData = UserMock.userData();
      const dto = UserMock.updateUserReqDto();
      const resDto = UserMock.toResponseDTO();
      const userBeforeUpdate = UserMock.userEntity();
      const userAfterUpdate = UserMock.userEntity(dto);

      jest
        .spyOn(mockUserRepository, 'findOneBy')
        .mockResolvedValue(userBeforeUpdate);
      jest.spyOn(mockUserRepository, 'save').mockResolvedValue(userAfterUpdate);
      jest.spyOn(UserMapper, 'toResponseDTO').mockReturnValue(resDto);

      const result = await service.updateMe(userData, dto);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        id: userData.userId,
      });
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(resDto);
      expect(result.id).toBe(resDto.id);
      expect(result.email).toBe(resDto.email);
    });
  });

  //Цей блок тестує різні сценарії для методу follow
  describe('follow', () => {
    //Цей тест перевіряє, чи метод follow кидає ConflictException, коли користувач намагається підписатися сам на себе.
    it('should throw ConflictException when user tries to follow himself', async () => {
      const userData = UserMock.userData(); //Ініціалізує тестові дані користувача, використовуючи моковий об'єкт UserMock
      //expect викликає метод follow, rejects перевіряє, чи метод follow кидає ConflictException, коли користувач намагається підписатися на себе
      await expect(service.follow(userData, userData.userId)).rejects.toThrow(
        ConflictException,
      );
    });

    //Цей тест перевіряє, чи метод follow кидає NotFoundException, якщо користувач, на якого намагаються підписатися, не існує.
    it('should throw NotFoundConflictExceptionException', async () => {
      const userData = UserMock.userData();
      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(null); //Імітує метод findOneBy в mockUserRepository і налаштовує його на повернення null. Це означає, що користувача не знайдено.
      await expect(service.follow(userData, 'testID')).rejects.toThrow(
        NotFoundException,
      );
    });

    //чи метод кидає помилку, якщо користувач існує, але намагається підписатися на себе
    it('should throw ConflictException when user tries to follow himself', async () => {
      const userData = UserMock.userData();
      const userEntity = UserMock.userEntity();
      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(userEntity); //Імітує повернення знайденого користувача.
      jest
        .spyOn(mockFollowRepository, 'findOneBy')
        .mockResolvedValue({} as any); //Імітує метод findOneBy в mockFollowRepository, щоб перевірити, чи вже існує запис про підписку.
      await expect(service.follow(userData, 'testID')).rejects.toThrow(
        ConflictException,
      );
    });

    //Цей тест перевіряє, чи метод follow успішно підписує одного користувача на іншого.
    it('should follow user', async () => {
      const userData = UserMock.userData();
      const userEntity = UserMock.userEntity();
      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(userEntity); // Імітує метод findOneBy для повернення існуючого користувача.
      jest.spyOn(mockFollowRepository, 'findOneBy').mockResolvedValue(null); // Імітує перевірку наявності існуючої підписки та повертає null, що означає, що підписки ще немає.
      jest.spyOn(mockFollowRepository, 'save').mockResolvedValue(null); // Імітує збереження нової підписки в репозиторії підписок (FollowRepository).

      await service.follow(userData, 'testID'); //Викликає метод follow, який здійснює підписку.

      //expect(...).toHaveBeenCalledTimes(1): Перевіряє, що кожен з методів (findOneBy і save) був викликаний один раз під час виконання тесту.
      expect(mockUserRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockFollowRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockFollowRepository.save).toHaveBeenCalledTimes(1);
    });
    //Ці тести гарантують, що метод follow працює коректно в різних ситуаціях і обробляє можливі виключення.
  });
});
