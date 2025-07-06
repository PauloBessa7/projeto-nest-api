import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CampaignPostsModule } from '../campaign-posts/campaign-posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CampaignPostsModule
  ],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
