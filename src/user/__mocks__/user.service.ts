import { MockServiceType } from '../../../test/__mocks__/types/mock-service.type';
import { UserService } from '../services/user.service';

//Оголошення константи mockUserService, яка представляє собою мок-версію сервісу UserService.
//Тип MockServiceType був оголошений раніше і представляє собою об'єкт, де всі методи UserService є моками.
export const mockUserService: MockServiceType<UserService> = {
  //Кожен метод сервісу, як наприклад getMe, замінюється на функцію-заглушку jest.fn(). Ця функція не виконує ніякої логіки, але може бути налаштована для повернення різних значень або для перевірки, як вона була викликана під час тестування
  getMe: jest.fn(), //jest.fn(): створює нову мок-функцію, яка використовується для тестування. Її можна налаштувати за допомогою різних методів, таких як mockReturnValue (повертає певне значення) або mockImplementation (визначає поведінку функції).
  updateMe: jest.fn(),
  getById: jest.fn(),
  remove: jest.fn(),
  follow: jest.fn(),
  unfollow: jest.fn(),
  isEmailUniqueOrThrow: jest.fn(),
  uploadAvatar: jest.fn(),
  deleteAvatar: jest.fn(),
  // всі ці методи аналогічно замінені на мок-функції
};
