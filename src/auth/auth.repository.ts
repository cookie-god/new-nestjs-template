import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { use } from 'passport';
import { UserInfo } from 'src/entity/user.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(UserInfo)
    private readonly userRepository: Repository<UserInfo>,
  ) {}

  async findUserById(id: number): Promise<UserInfo> | null {
    const user: UserInfo | null = await this.userRepository.findOne({
      where: {
        id: id,
        status: 'ACTIVE',
      },
    });
    return user;
  }

  async findUserBySnsId(
    snsId: number,
    manager: EntityManager,
  ): Promise<UserInfo> | null {
    const user: UserInfo | null = await manager
      .getRepository(UserInfo)
      .findOne({
        where: {
          snsId: snsId,
          status: 'ACTIVE',
        },
      });
    return user;
  }

  async saveUser(
    userInfo: UserInfo,
    manager: EntityManager,
  ): Promise<UserInfo> {
    const user = manager.create(UserInfo, userInfo);
    return manager.save(user);
  }
}
