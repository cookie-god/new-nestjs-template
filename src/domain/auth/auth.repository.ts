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

  async findUserById(id: number): Promise<UserInfo> | null {
    const user: UserInfo | null = await this.userRepository.findOne({
      where: {
        id: id,
        status: 'ACTIVE',
      },
    });
    return user;
  }

  /**
   * 이메일 중복 검사 함수
   */
  async isExistEmail(email: string, manager: EntityManager) {
    const result: { exist: number } = await manager.query(
      `SELECT EXISTS (SELECT 1 FROM USER_INFO WHERE email = ?) AS exist`,
      [email],
    );
    return result[0]?.exist === 1;
  }

  /**
   * 닉네임 중복 검사 함수
   */
  async isExistNickname(nickname: string, manager: EntityManager) {
    const result: { exist: number } = await manager.query(
      `SELECT EXISTS (SELECT 1 FROM USER_INFO WHERE nickname = ?) AS exist`,
      [nickname],
    );
    return result[0]?.exist === 1;
  }

  /**
   * 유저 저장 함수
   */
  async saveUser(
    userInfo: UserInfo,
    manager: EntityManager,
  ): Promise<UserInfo> {
    const user = manager.create(UserInfo, userInfo);
    return manager.save(user);
  }
}
