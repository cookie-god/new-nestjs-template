import { Injectable } from '@nestjs/common';
import { PostUsersRequestDto } from './dto/request/post-users.request.dto';

@Injectable()
export class UsersService {
    async createUsers(postUserDto: PostUsersRequestDto) {
        return postUserDto;
    }
}
