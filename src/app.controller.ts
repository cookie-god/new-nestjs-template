import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { UserInfo } from './entity/user.entity';
import { User } from './decorator/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@User() userInfo: UserInfo): Promise<UserInfo> {
    return userInfo;
    // return this.appService.getHello();
  }
}
