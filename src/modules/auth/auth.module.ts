
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from '../../config/jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
   UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
