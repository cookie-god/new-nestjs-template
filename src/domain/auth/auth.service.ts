import { Injectable } from '@nestjs/common';
import { UserInfo } from 'src/entity/user.entity';
import { AuthRepository } from './auth.repository';
import { DataSource, QueryRunner } from 'typeorm';
import { payload } from './interface/user-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { logger } from 'src/config/logger/logger';
import { ROLE } from 'src/enums/role.enum';
import { PostSignUpRequestDto } from './dto/request/post-sign-up-request.dto';
import {
  DuplicateEmailException,
  DuplicateNicknameException,
  InternalServiceException,
  ServiceException,
} from 'src/config/exception/service.exception';
import { PasswordUtil } from 'src/util/password.util';
import { PostSignUpResponseDto } from './dto/request/post-sign-up-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private dataSource: DataSource,
  ) {}

  /**
   * 유저 회원가입 함수
   */
  async createUsers(
    data: PostSignUpRequestDto,
  ): Promise<PostSignUpResponseDto> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 이메일 중복 검사
      if (
        await this.authRepository.isExistEmail(data.email, queryRunner.manager)
      ) {
        throw DuplicateEmailException();
      }

      // 닉네임 중복 검사
      if (
        await this.authRepository.isExistNickname(
          data.nickname,
          queryRunner.manager,
        )
      ) {
        throw DuplicateNicknameException();
      }

      // 유저 저장
      const userInfo: UserInfo = await this.authRepository.saveUser(
        this.makeUserInfoEntity(
          data.email,
          await PasswordUtil.hashPassword(data.password),
          data.nickname,
        ),
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
      return plainToInstance(PostSignUpResponseDto, {
        id: userInfo.id,
        email: userInfo.email,
        nickname: userInfo.nickname,
        role: userInfo.role,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof ServiceException) {
        throw error;
      } else {
        throw InternalServiceException();
      }
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 유저 엔티티를 만들어주는 함수
   */
  makeUserInfoEntity(
    email: string,
    password: string,
    nickname: string,
  ): UserInfo {
    return plainToInstance(UserInfo, {
      id: null,
      email: email,
      password: password,
      nickname: nickname,
      role: ROLE.USER,
    });
  }
}
