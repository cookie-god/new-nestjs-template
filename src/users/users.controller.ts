import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { PostUsersDto } from './dto/post-users.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post()
    async postUsers(@Body() postUsersDto: PostUsersDto ) {
        return this.usersService.createUsers(postUsersDto);
    }
}
