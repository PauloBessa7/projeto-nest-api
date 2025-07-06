import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

    async findUserCampaigns(userId: string): Promise<CampaignPost[]> {
        return this.campaignPostsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
    }

    async deleteCampaignPost(userId: string, campaignId: string): Promise<void> {
        const campaign = await this.campaignPostsRepository.findOne({
            where: { id: campaignId }
        });

        if (!campaign) {
            throw new NotFoundException('Campanha não encontrada.');
        }

        if (campaign.userId !== userId) {
            throw new ForbiddenException('Você não tem permissão para deletar esta campanha.');
        }

        await this.campaignPostsRepository.remove(campaign);
    }
}
