import { Injectable } from '@nestjs/common';

import { NotExistUserException } from './config/exception/service.exception';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    throw NotExistUserException();
    return 'Hello World!';
  }
}
