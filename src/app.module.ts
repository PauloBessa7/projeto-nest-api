import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql', 
    host: 'mainline.proxy.rlwy.net',
    port: 42419,
    username: 'root',
    password: 'ZIybEeRSRqpQCMMJRVYSgSmezAdygcLK',
    database: 'railway',
    entities: [__dirname + '/**/*.entity{.ts,.js}'], // Isso irá encontrar todas as entidades
    synchronize: true, // false em produção
  }),
  AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
