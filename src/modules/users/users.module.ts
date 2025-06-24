
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles.guard';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UsersService, {
    provide: APP_GUARD,
    useClass: RolesGuard,
  }],
  exports: [UsersService],
})
export class UsersModule {}
