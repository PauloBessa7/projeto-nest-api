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

    async create(createCampaignPostDto: CreateCampaignPostsDto): Promise<CampaignPost> {
        const campaignPost = this.campaignPostsRepository.create(createCampaignPostDto);
        return this.campaignPostsRepository.save(campaignPost);
    }
}
