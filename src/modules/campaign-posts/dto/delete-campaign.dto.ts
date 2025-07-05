import { IsUUID } from 'class-validator';

export class DeleteCampaignDto {
  @IsUUID('4', { message: 'ID da campanha deve ser um UUID válido.' })
  campaignId: string;
} 