import { Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from './enum/user.enum';
@Controller('users')
export class UserController {
    constructor(private readonly userService: UsersService) {}

    @Post('create')
    @Roles(Role.Admin)
    createUser() {
        return this.userService.createUser();
    }
}


