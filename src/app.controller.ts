import { Controller, Get, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserInfo } from './entity/user.entity';
import { User } from './decorator/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get()
  async getHello(@User() userInfo: UserInfo): Promise<UserInfo> {
    return userInfo;
    // return this.appService.getHello();
  }
}
