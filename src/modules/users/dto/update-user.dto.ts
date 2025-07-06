import { IsOptional, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome não pode estar vazio' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Partner Tag Amazon deve ser uma string' })
  partnerTagAmazon?: string;

  @IsOptional()
  @IsString({ message: 'Public Key Amazon deve ser uma string' })
  publicKeyAmazon?: string;

  @IsOptional()
  @IsString({ message: 'Private Key Amazon deve ser uma string' })
  privateKeyAmazon?: string;
} 