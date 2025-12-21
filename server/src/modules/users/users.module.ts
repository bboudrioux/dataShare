import { Module } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { UserService } from './users.service';
import { UserController } from './users.controller';

@Module({
  providers: [UserRepository, UserService],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UserModule {}
