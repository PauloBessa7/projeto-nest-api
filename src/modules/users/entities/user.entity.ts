import { CampaignPost } from 'src/modules/campaign-posts/entities/campaign-posts.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from 'typeorm';

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

  @Column({ type: 'datetime', nullable: true })
  expireAt: Date;

  @Column({ nullable: true })
  privateSalt: string;
  
  @BeforeInsert()
  protected setExpireAt(): void {
    if (!this.expireAt) {
      const now = new Date();
      now.setDate(now.getDate() + 4);
      this.expireAt = now;
    }
  }

  @Column({ nullable: true })
  publicKeyAmazon: string

  @Column({ nullable: true })
  privateKeyAmazon: string

  @Column({ nullable: true })
  partnerTagAmazon: string

  @OneToMany(() => CampaignPost, campaignPost => campaignPost.user)
  campaignPosts: CampaignPost[];
}