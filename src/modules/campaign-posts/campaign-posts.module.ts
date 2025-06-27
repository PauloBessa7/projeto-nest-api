import { Module } from '@nestjs/common';
import { CampaignPostsService } from './campaign-posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignPost } from './entities/campaign-posts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CampaignPost])
  ],
  providers: [CampaignPostsService],
  exports: [CampaignPostsService]
})

export class CampaignPostsModule {}
