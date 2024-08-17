import { Module } from '@nestjs/common';

import { FileStorageModule } from '../modules/file-storage/file-storage.module';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [FileStorageModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
