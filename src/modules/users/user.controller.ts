import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { SkipAuth } from 'src/common/decorators/public.decorator';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UsersService) { }

    @Post()
    @SkipAuth()
    @HttpCode(HttpStatus.CREATED) // Retorna status 201 Created
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Validação de DTO
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }
}


