export class UpdateUserResponseDto {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  expireAt: Date;
  secretKeyAmazon: string;
  publicKeyAmazon: string;
  partnerTagAmazon: string;
  message: string;
} 