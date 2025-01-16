import { Body, Controller, Post } from '@nestjs/common';

import { UsersService } from './users.service';
import { PostUsersRequestDto } from '../auth/dto/request/post-users.request.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async postUsers(@Body() postUsersDto: PostUsersRequestDto) {
    return this.usersService.createUsers(postUsersDto);
  }
}
