import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CampaignPost } from './entities/campaign-posts.entity';
import { Repository } from 'typeorm';
import { CreateCampaignPostsDto } from './dto/create-campaign-posts.dto';

@Injectable()
export class CampaignPostsService {
    constructor(
        @InjectRepository(CampaignPost)
        private campaignPostsRepository: Repository<CampaignPost>,
    ) { }

    async createCampaignPost(id: string, createCampaignPostDto: CreateCampaignPostsDto): Promise<CampaignPost | undefined> {
        const campaign = this.campaignPostsRepository.create({
          ...createCampaignPostDto,
          userId: id
        });
    
        return this.campaignPostsRepository.save(campaign);
      }
}
