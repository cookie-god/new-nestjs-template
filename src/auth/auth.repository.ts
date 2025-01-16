import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from 'src/entity/user.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(UserInfo)
    private readonly userRepository: Repository<UserInfo>,
  ) {}

  async saveUser(
    userInfo: UserInfo,
    manager: EntityManager,
  ): Promise<UserInfo> {
    const user = manager.create(UserInfo, userInfo);
    return manager.save(user);
  }
}
