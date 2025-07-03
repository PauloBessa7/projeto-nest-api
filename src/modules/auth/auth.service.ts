import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(username);
    if (!user || user.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = {id: user.id, name: user.name, email: user.email, isActive: user.isActive, createdAt: user.createdAt, updatedAt: user.updatedAt, campaignPosts: user.campaignPosts};
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
