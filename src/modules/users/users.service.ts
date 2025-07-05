import { ConflictException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { CampaignPost } from '../campaign-posts/entities/campaign-posts.entity';
import { CreateCampaignPostsDto } from '../campaign-posts/dto/create-campaign-posts.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(CampaignPost)
    private campaignRespository: Repository<CampaignPost>
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name, publicKeyAmazon, privateKeyAmazon, partnerTagAmazon } = createUserDto;

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Este email já está em uso.');
    }
    
    const hash = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      email,
      password: hash,
      name: name,
      publicKeyAmazon: publicKeyAmazon,
      privateKeyAmazon: privateKeyAmazon,
      partnerTagAmazon: partnerTagAmazon
    });

    return this.usersRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  

  async createCampaignPost(id: string, createCampaignPostDto: CreateCampaignPostsDto): Promise<CampaignPost | undefined> {
    const campaign = this.campaignRespository.create({
      ...createCampaignPostDto,
      userId: id
    });

    return this.campaignRespository.save(campaign);
  }

  async findUserCampaigns(userId: string): Promise<CampaignPost[]> {
    return this.campaignRespository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findUserWithCampaigns(userId: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id: userId },
      relations: ['campaignPosts'],
      order: { campaignPosts: { createdAt: 'DESC' } }
    });
  }

  async deleteCampaignPost(userId: string, campaignId: string): Promise<void> {
    // Buscar a campanha para verificar se existe e se pertence ao usuário
    const campaign = await this.campaignRespository.findOne({
      where: { id: campaignId }
    });

    if (!campaign) {
      throw new NotFoundException('Campanha não encontrada.');
    }

    if (campaign.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para deletar esta campanha.');
    }

    // Deletar a campanha
    await this.campaignRespository.remove(campaign);
  }
}
