
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]) // <-- ESTA É A LINHA CRÍTICA! Certifique-se que está presente e com 'User'
  ],
  controllers: [UserController],
  providers: [UsersService, {
    provide: APP_GUARD,
    useClass: RolesGuard,
  }],
  exports: [UsersService],
})
export class UsersModule {}
