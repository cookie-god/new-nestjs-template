import { Injectable } from '@nestjs/common';
import { UserInfo } from 'src/entity/user.entity';
import { AuthRepository } from './auth.repository';
import { DataSource, QueryRunner } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { logger } from 'src/config/logger/logger';
import { ROLE } from 'src/enums/role.enum';
import { PostSignUpRequestDto } from './dto/request/post-sign-up-request.dto';
import {
  DuplicateEmailException,
  DuplicateNicknameException,
  InternalServiceException,
  NotExistRefreshTokenException,
  NotExistUserException,
  NotMatchPasswordException,
  ServiceException,
} from 'src/config/exception/service.exception';
import { PostSignUpResponseDto } from './dto/response/post-sign-up-response.dto';
import * as bcrypt from 'bcrypt';
import { PostSignInRequestDto } from './dto/request/post-sign-in-request.dto';
import { PostSignInResponseDto } from './dto/response/post-sign-in-response.dto';
import { SecretRefreshPayload } from './interface/secret-refresh-payload.interface';
import { SecretAccessPayload } from './interface/secret-access-payload.interface';
import { BcryptService } from '../bcrypt/bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly bcryptService: BcryptService,
    private dataSource: DataSource,
  ) {}

  /**
   * jwt 검증시 유저 아이디 기반으로 찾는 함수
   */
  async retrieveUser(id: number) {
    return await this.authRepository.findUserById(id);
  }

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
          await this.bcryptService.hash(data.password),
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
      logger.error(error);
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
   * 로그인 함수
   */
  async login(data: PostSignInRequestDto): Promise<PostSignInResponseDto> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    try {
      const userInfo: UserInfo = await this.authRepository.findUserInfoByEmail(
        data.email,
        queryRunner.manager,
      );
      if (userInfo === null) {
        throw NotExistUserException();
      }

      if (
        !(await this.bcryptService.compare(data.password, userInfo.password))
      ) {
        throw NotMatchPasswordException();
      }
      const accessToken = await this.createAccessToken(userInfo);
      const refreshToken = await this.createRefreshToken(userInfo);
      const hashedRefreshToken = await this.bcryptService.hash(refreshToken);

      await this.authRepository.editUserRefreshToken(
        userInfo.id,
        hashedRefreshToken,
        queryRunner.manager,
      );

      return plainToClass(PostSignInResponseDto, {
        accessToken: accessToken,
        refreshToken: refreshToken,
        email: userInfo.email,
        nickname: userInfo.nickname,
        role: userInfo.role,
      });
    } catch (error) {
      logger.error(error);
      if (error instanceof ServiceException) {
        throw error;
      } else {
        throw InternalServiceException();
      }
    } finally {
      queryRunner.release();
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

  /**
   * 암호화 된 refresh token 비교하는 함수
   */
  async compareRefreshToken(
    userInfo: UserInfo,
    refreshToken: string,
  ): Promise<boolean> {
    if (!userInfo.refreshToken) {
      throw NotExistRefreshTokenException();
    }
    const result = await bcrypt.compare(refreshToken, userInfo.refreshToken);
    return result;
  }

  /**
   * access token 발급하는 함수
   */
  async createAccessToken(userInfo: UserInfo): Promise<string> {
    const payload: SecretAccessPayload = {
      id: this.bcryptService.encrypt(userInfo.id),
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRE_DATE'),
    });
    return accessToken;
  }

  /**
   * refresh token 발급하는 함수
   */
  async createRefreshToken(userInfo: UserInfo): Promise<string> {
    const payload: SecretRefreshPayload = {
      id: this.bcryptService.encrypt(userInfo.id),
    };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRE_DATE'),
    });
    return refreshToken;
  }
}
