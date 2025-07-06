import { ConflictException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { CampaignPostsService } from '../campaign-posts/campaign-posts.service';

@Injectable()
export class UsersService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly encryptionKey: string;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private readonly configService: ConfigService,
    private readonly campaignPostsService: CampaignPostsService,
  ) {
    this.encryptionKey = this.configService.get<string>('ENCRYPTION_KEY')!;
    if (!this.encryptionKey) {
      throw new Error('A variável de ambiente ENCRYPTION_KEY não está definida.');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name, publicKeyAmazon, privateKeyAmazon, partnerTagAmazon } = createUserDto;

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Este email já está em uso.');
    }

    const hashPasswod = await bcrypt.hash(password, 10);

    let privateKeySalt: string | null = null;
    let encryptedPrivateSalt = privateKeyAmazon;

    if (privateKeyAmazon) {
      privateKeySalt = crypto.randomBytes(16).toString('hex');

      const key = crypto.scryptSync(this.encryptionKey, privateKeySalt, 32);
      const iv = crypto.randomBytes(16);

      const cipher = crypto.createCipheriv(this.algorithm, key, iv);
      let encrypted = cipher.update(privateKeyAmazon, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      encryptedPrivateSalt = `${iv.toString('hex')}:${encrypted}`;
    }

    const newUser = this.usersRepository.create({
      email,
      password: hashPasswod,
      name: name,
      publicKeyAmazon: publicKeyAmazon,
      privateKeyAmazon: encryptedPrivateSalt,
      privateSalt: privateKeySalt || undefined,
      partnerTagAmazon: partnerTagAmazon
    });

    return this.usersRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findUserCampaigns(userId: string) {
    return this.campaignPostsService.findUserCampaigns(userId);
  }

  async findUserWithCampaigns(userId: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['campaignPosts'],
      order: { campaignPosts: { createdAt: 'DESC' } }
    });

    if (user && user.privateKeyAmazon && user.privateSalt) {
      user.privateKeyAmazon = this.decryptPrivateKey(user.privateKeyAmazon, user.privateSalt);
    }

    return user;
  }

  async deleteCampaignPost(userId: string, campaignId: string): Promise<void> {
    return this.campaignPostsService.deleteCampaignPost(userId, campaignId);
  }

  private decryptPrivateKey(encryptedPrivateKey: string, salt: string): string {

    if (!encryptedPrivateKey || !salt) {
      return encryptedPrivateKey;
    }

    if (!encryptedPrivateKey || !encryptedPrivateKey.includes(':')) {
      return encryptedPrivateKey;
    }

    try {
      const key = crypto.scryptSync(this.encryptionKey, salt, 32);

      const parts = encryptedPrivateKey.split(':');
      if (parts.length !== 2) {
        return encryptedPrivateKey;
      }
      const iv = Buffer.from(parts[0], 'hex');
      const encryptedText = parts[1];

      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      console.error("Falha ao descriptografar a chave:", error);
      return encryptedPrivateKey;
    }

  }

  decryptPrivateKeyAmazon(encryptedPrivateKey: string, salt: string): string {
    return this.decryptPrivateKey(encryptedPrivateKey, salt);
  }

  async toggleUserActive(userId: string, isActive: boolean): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    user.isActive = isActive;
    return this.usersRepository.save(user);
  }

  async updateUser(userId: string, updateUserDto: any): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Sua conta está desativada. Entre em contato com o suporte.');
    }

    let encryptedPrivateKeyAmazon = updateUserDto.privateKeyAmazon;
    if (updateUserDto.privateKeyAmazon) {
      const privateKeySalt = crypto.randomBytes(16).toString('hex');
      const key = crypto.scryptSync(this.encryptionKey, privateKeySalt, 32);
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);
      let encrypted = cipher.update(updateUserDto.privateKeyAmazon, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      encryptedPrivateKeyAmazon = iv.toString('hex') + ':' + encrypted;

      user.privateSalt = privateKeySalt;
    }

    if (updateUserDto.name !== undefined) {
      user.name = updateUserDto.name;
    }

    if (updateUserDto.partnerTagAmazon !== undefined) {
      user.partnerTagAmazon = updateUserDto.partnerTagAmazon;
    }
    if (updateUserDto.publicKeyAmazon !== undefined) {
      user.publicKeyAmazon = updateUserDto.publicKeyAmazon;
    }
    if (updateUserDto.privateKeyAmazon !== undefined) {
      user.privateKeyAmazon = encryptedPrivateKeyAmazon;
    }

    return this.usersRepository.save(user);
  }
}
