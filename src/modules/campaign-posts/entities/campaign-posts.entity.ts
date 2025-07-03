import { User } from 'src/modules/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from 'typeorm';

@Entity('campaign_posts')
export class CampaignPost {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    productTitle: string;

    @Column({ nullable: false })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    promotion?: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: false })
    urlImage: string;

    @Column({ nullable: false })
    urlAssociate: string;

    @Column({ type: 'uuid', nullable: false})
    userId: string;

    @Column({ nullable: false })
    amazonProductId: string;

    @ManyToOne(() => User, (user) => user.campaignPosts, { eager: false })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
