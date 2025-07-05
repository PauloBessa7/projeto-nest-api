import { Body, Controller, HttpCode, HttpStatus, Post, Get, Delete, Param, UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { SkipAuth } from 'src/common/decorators/public.decorator';
import { CreateCampaignPostsDto } from '../campaign-posts/dto/create-campaign-posts.dto';
import { CampaignPost } from '../campaign-posts/entities/campaign-posts.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserPayload } from 'src/common/interfaces/user-payload.interface';
import { CampaignPostResponseDto } from '../campaign-posts/dto/campaign-post-response.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { DeleteCampaignDto } from '../campaign-posts/dto/delete-campaign.dto';

@Controller('users')
export class UserController {
    
    constructor(private readonly userService: UsersService) { }

    @Post()
    @SkipAuth()
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @Get('debug/all')
    @SkipAuth()
    async getAllUsers(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Post('create-campaign')
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async createCampaignPost(
        @Body() createCampaignPost: CreateCampaignPostsDto,
        @CurrentUser() user: UserPayload
    ): Promise<CampaignPost | undefined> {
        return this.userService.createCampaignPost(user.id, createCampaignPost);
    }

    @Get('my-campaigns')
    async getUserCampaigns(@CurrentUser() user: UserPayload): Promise<CampaignPostResponseDto[]> {
        const campaigns = await this.userService.findUserCampaigns(user.id);
        return campaigns.map(campaign => ({
          id: campaign.id,
          productTitle: campaign.productTitle,
          description: campaign.description,
          price: campaign.price,
          promotion: campaign.promotion,
          urlImage: campaign.urlImage,
          urlAssociate: campaign.urlAssociate,
          amazonProductId: campaign.amazonProductId,
          createdAt: campaign.createdAt
        }));
    }

    @Get('profile')
    async getUserProfile(@CurrentUser() user: UserPayload): Promise<UserProfileDto | null> {
        const userWithCampaigns = await this.userService.findUserWithCampaigns(user.id);
        
        if (!userWithCampaigns) {
            return null;
        }

        return {
          id: userWithCampaigns.id,
          name: userWithCampaigns.name,
          email: userWithCampaigns.email,
          isActive: userWithCampaigns.isActive,
          expireAt: userWithCampaigns.expireAt,
          campaignPosts: userWithCampaigns.campaignPosts?.map(campaign => ({
            id: campaign.id,
            productTitle: campaign.productTitle,
            description: campaign.description,
            price: campaign.price,
            promotion: campaign.promotion,
            urlImage: campaign.urlImage,
            urlAssociate: campaign.urlAssociate,
            amazonProductId: campaign.amazonProductId,
            createdAt: campaign.createdAt
          })) || []
        };
    }

    @Delete('campaigns/:campaignId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UsePipes(new ValidationPipe({ transform: true }))
    async deleteCampaignPost(
        @Param() params: DeleteCampaignDto,
        @CurrentUser() user: UserPayload
    ): Promise<void> {
        await this.userService.deleteCampaignPost(user.id, params.campaignId);
    }
}


