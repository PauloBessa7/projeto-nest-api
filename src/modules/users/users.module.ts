import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CampaignPost } from '../campaign-posts/entities/campaign-posts.entity';
import { CampaignPostsService } from '../campaign-posts/campaign-posts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, CampaignPost])
  ],
  controllers: [UserController],
  providers: [UsersService, CampaignPostsService],
  exports: [UsersService],
})
export class UsersModule {}
