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
    // Corrigindo o método para buscar o usuário pelo nome de usuário
    const user = await this.usersService.findByEmail(username);
    if (!user || user.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.firstName};
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
