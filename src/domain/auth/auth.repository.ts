import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { STATUS } from '../../enums/status.enum';
import { UserInfo } from '../../entity/user.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(UserInfo)
    private readonly userRepository: Repository<UserInfo>,
  ) {}

  /**
   * jwt 검증시 유저 아이디 기반으로 찾는 함수
   */
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
      `SELECT EXISTS (SELECT 1 FROM USER_INFO WHERE email = ? and STATUS = ?) AS exist`,
      [email, STATUS.ACTIVE],
    );
    return result[0]?.exist === 1;
  }

  /**
   * 닉네임 중복 검사 함수
   */
  async isExistNickname(nickname: string, manager: EntityManager) {
    const result: { exist: number } = await manager.query(
      `SELECT EXISTS (SELECT 1 FROM USER_INFO WHERE nickname = ? and STATUS = ?) AS exist`,
      [nickname, STATUS.ACTIVE],
    );
    return result[0]?.exist === 1;
  }

  /**
   * 이메일 통해서 유저 조회하는 함수
   */
  async findUserInfoByEmail(email: string, manager: EntityManager) {
    return await manager.getRepository(UserInfo).findOne({
      where: {
        email: email,
        status: STATUS.ACTIVE,
      },
    });
  }

  /**
   * refresh 토큰 저장하는 함수
   */
  async editUserRefreshToken(
    id: number,
    hashedRefreshToken: string,
    manager: EntityManager,
  ): Promise<void> {
    await manager
      .createQueryBuilder()
      .update(UserInfo)
      .set({
        refreshToken: hashedRefreshToken,
      })
      .where('id = :id', { id: id })
      .execute();
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
