import { Controller, Get, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { UserInfo } from './entity/user.entity';
import { User } from './decorator/user.decorator';
import { JwtAccessTokenGuard } from './domain/auth/guard/access-token.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('JWT')
  @Get()
  async getHello(@User() userInfo: UserInfo): Promise<UserInfo> {
    return userInfo;
    // return this.appService.getHello();
  }
}
