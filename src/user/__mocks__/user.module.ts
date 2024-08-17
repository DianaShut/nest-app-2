import { Provider } from '@nestjs/common';

import { mockFileStorageService } from '../../modules/file-storage/__mocks__/file-storage.service';
import { FileStorageService } from '../../modules/file-storage/services/file-storage.service';
import { mockLoggerService } from '../../modules/logger/__mocks__/logger.service';
import { LoggerService } from '../../modules/logger/logger.service';
import { mockFollowRepository } from '../../modules/repository/__mocks__/follow.repository';
import { mockUserRepository } from '../../modules/repository/__mocks__/user.repository';
import { FollowRepository } from '../../modules/repository/services/follow.repository';
import { UserRepository } from '../../modules/repository/services/user.repository';
import { UserService } from '../services/user.service';
import { mockUserService } from './user.service';

export const mockUserProviders: Provider[] = [
  {
    provide: LoggerService,
    useValue: mockLoggerService,
  },
  {
    provide: UserRepository,
    useValue: mockUserRepository,
  },
  {
    provide: FollowRepository,
    useValue: mockFollowRepository,
  },
  {
    provide: FileStorageService,
    useValue: mockFileStorageService,
  },
  {
    provide: UserService,
    useValue: mockUserService,
  },
];
