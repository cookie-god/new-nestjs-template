import { Injectable, NotFoundException } from '@nestjs/common';

import { NotExistUserException } from './config/exception/service.exception';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    throw new NotFoundException();
    return 'Hello World!';
  }
}
