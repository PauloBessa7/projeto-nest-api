// src/modules/users/entities/user.entity.ts
import { CampaignPost } from 'src/modules/campaign-posts/entities/campaign-posts.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CampaignPost, campaignPost => campaignPost.user)
  campaignPosts: CampaignPost[]; // Propriedade para carregar uma coleção de CampaignPost
}