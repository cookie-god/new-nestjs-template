import { Injectable } from '@nestjs/common';

import { PostUsersRequestDto } from '../auth/dto/request/post-users.request.dto';
import { NotExistUserException } from 'src/config/exception/service.exception';

@Injectable()
export class UsersService {
  async createUsers(postUserDto: PostUsersRequestDto) {
    throw NotExistUserException();
    return postUserDto;
  }
}
