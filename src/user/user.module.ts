import { Module } from '@nestjs/common';

import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { FileStorageModule } from '../modules/file-storage/file-storage.module';

@Module({
  imports: [FileStorageModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
