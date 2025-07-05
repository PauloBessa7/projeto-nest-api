import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString({ message: 'O nome deve ser uma string.' })
    @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
    name: string;

    @IsEmail({}, { message: 'O email deve ser um endereço de email válido.' })
    @IsNotEmpty({ message: 'O email não pode ser vazio.' })
    email: string;

    @IsString({ message: 'A senha deve ser uma string.' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
    @IsNotEmpty({ message: 'A senha não pode ser vazia.' })
    password: string;

    @IsOptional()
    @IsString()
    publicKeyAmazon?: string;

    @IsOptional()
    @IsString()
    privateKeyAmazon?: string;

    @IsOptional()
    @IsString()
    partnerTagAmazon?: string;
}
