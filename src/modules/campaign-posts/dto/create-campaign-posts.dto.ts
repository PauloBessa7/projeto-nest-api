import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCampaignPostsDto {
  @IsString({ message: 'Product title must be a string.' })
  @IsNotEmpty({ message: 'Product title cannot be empty.' })
  productTitle: string;

  @IsString({ message: 'Description must be a string.' })
  @IsNotEmpty({ message: 'Description cannot be empty.' })
  description: string;

  @IsNumber({}, { message: 'Price must be a number.' })
  @IsNotEmpty({ message: 'Price cannot be empty.' })
  price: number;

  @IsNumber({}, { message: 'Promotion must be a number.' })
  @Optional()
  promotion?: number;

  @IsString({ message: 'Image URL must be a string.' })
  @IsNotEmpty({ message: 'Image URL cannot be empty.' })
  urlImage: string;

  @IsString({ message: 'Associate URL must be a string.' })
  @IsNotEmpty({ message: 'Associate URL cannot be empty.' })
  urlAssociate: string;

  // @IsString({ message: 'User ID must be a string.' })
  // @IsNotEmpty({ message: 'User ID cannot be empty.' })
  // userId: string;

  // Observações(Não são erros, mas considerações de design):

  // userId no DTO: Como discutimos, se a postagem for sempre criada pelo usuário atualmente logado(o cenário mais comum para criar uma postagem vinculada a um usuário), então o userId não deveria vir do cliente no DTO.Em vez disso, ele seria obtido do payload do JWT(ou outra forma de autenticação) no Controller e injetado no serviço.

  // Se for sempre do usuário logado: Remova @IsString e @IsNotEmpty de userId e o próprio campo userId do DTO.

  // Se um admin puder criar postagens para outros usuários: Mantenha como está, mas adicione lógica de autorização para garantir que apenas usuários com permissão possam especificar um userId diferente do seu próprio.

  // Meu conselho: Na maioria dos casos, para uma API onde o próprio usuário cria suas postagens, remova userId do DTO de entrada e obtenha - o do contexto de autenticação no controller.

  @IsString({ message: 'Amazon product ID must be a string.' })
  @IsNotEmpty({ message: 'Amazon product ID cannot be empty.' })
  amazonProductId: string;
}
