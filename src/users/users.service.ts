import { Injectable } from '@nestjs/common';
import { PostUsersDto } from './dto/post-users.dto';

@Injectable()
export class UsersService {
    async createUsers(postUserDto: PostUsersDto) {
        return postUserDto;
    }
}
