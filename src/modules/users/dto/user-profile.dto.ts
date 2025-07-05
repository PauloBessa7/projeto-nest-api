import { CampaignPostResponseDto } from '../../campaign-posts/dto/campaign-post-response.dto';

export class UserProfileDto {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  expireAt: Date;
  campaignPosts: CampaignPostResponseDto[];
} 