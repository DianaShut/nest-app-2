import { Test } from '@nestjs/testing';

import { UserMock } from '../../test/__mocks__/user.mock';
import { mockUserProviders } from './__mocks__/user.module';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

//describe — це метод Jest, який групує тести, пов'язані з UserController. Використання UserController.name динамічно отримує ім'я класу, що робить тести більш читабельними.
describe(UserController.name, () => {
  let controller: UserController;
  let mockService: UserService;

  //beforeEach — це хук, який виконується перед кожним тестом в даному блоці describe. Він використовується для ініціалізації умов тестування, щоб забезпечити, що кожен тест виконується незалежно від інших.
  beforeEach(async () => {
    //Створюємо тестовий модуль, використовуючи Test.createTestingModule. Він налаштовується з контролерами та провайдерами. У цьому випадку ми передаємо UserController до списку контролерів і масив імітованих провайдерів для налаштування необхідних залежностей.
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [...mockUserProviders],
    }).compile();
    controller = module.get<UserController>(UserController);
    mockService = module.get<UserService>(UserService);
    //Отримуємо екземпляри UserController та імітованого UserService з створеного тестового модуля. Це дозволяє нам викликати методи контролера і стежити за викликами методу сервісу.
  });

  //afterEach — це хук, який виконується після кожного тесту. Він скидає всі імітовані функції, щоб гарантувати, що кожен тест не залежить від попередніх, і щоб уникнути побічних ефектів від використання імітацій.
  afterEach(() => {
    jest.resetAllMocks();
  });

  //it — це метод Jest для визначення окремого тестового випадку. Тут ми перевіряємо, чи контролер визначений, щоб підтвердити, що він був успішно ініціалізований перед виконанням тестів.
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //Додатковий блок describe для групування тестів, пов'язаних з методом getMe контролера. Цей тест перевіряє, чи метод getMe контролера повертає правильні дані користувача.
  describe('getMe', () => {
    it('should return user', async () => {
      //Створюємо змінні, які зберігають дані користувача (userData) та очікуваний об'єкт відповіді (resDto) за допомогою імітованих даних.
      const userData = UserMock.userData();
      const resDto = UserMock.toResponseDTO();

      jest.spyOn(mockService, 'getMe').mockResolvedValue(resDto); //створює імітацію для методу getMe сервісу mockService та налаштовує його на повернення значення resDto. Це дозволяє тесту контролювати поведінку сервісу.

      //Викликаємо метод getMe контролера з імітованими даними користувача.
      const result = await controller.getMe(userData);
      //Перевіряємо, чи був метод getMe сервісу викликаний з правильними параметрами, і чи результат відповідає очікуваному об'єкту відповіді.
      expect(mockService.getMe).toHaveBeenCalledWith(userData);
      expect(result).toEqual(resDto);
    });
  });
});
