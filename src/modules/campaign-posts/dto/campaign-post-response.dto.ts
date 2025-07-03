export class CampaignPostResponseDto {
  id: string;
  productTitle: string;
  description: string;
  price: number;
  promotion?: number;
  urlImage: string;
  urlAssociate: string;
  amazonProductId: string;
  createdAt: Date;
} 