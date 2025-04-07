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
import { BaseService } from 'src/service/base.service';
import { ModuleRef } from '@nestjs/core';
import { Transactional } from 'src/decorator/transactional.decorator';
import { ReadOnly } from 'src/decorator/readonly.decorator';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    moduleRef: ModuleRef,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly bcryptService: BcryptService,
    private dataSource: DataSource,
  ) {
    super(moduleRef);
  }

  /**
   * jwt 검증시 유저 아이디 기반으로 찾는 함수
   */
  async retrieveUser(id: number) {
    return await this.authRepository.findUserById(id);
  }

  /**
   * 유저 회원가입 함수
   */
  @Transactional()
  async createUsers(
    data: PostSignUpRequestDto,
  ): Promise<PostSignUpResponseDto> {
    // 이메일 중복 검사
    if (await this.authRepository.isExistEmail(data.email, this.manager)) {
      throw DuplicateEmailException();
    }

    // 닉네임 중복 검사
    if (
      await this.authRepository.isExistNickname(data.nickname, this.manager)
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
      this.manager,
    );

    const result: PostSignUpResponseDto = new PostSignUpResponseDto();
    result.id = userInfo.id;
    result.email = userInfo.email;
    result.nickname = userInfo.nickname;
    result.role = userInfo.role;

    return result;
  }

  /**
   * 로그인 함수
   */
  @ReadOnly()
  async login(data: PostSignInRequestDto): Promise<PostSignInResponseDto> {
    const userInfo: UserInfo = await this.authRepository.findUserInfoByEmail(
      data.email,
      this.manager,
    );
    if (userInfo === null) {
      throw NotExistUserException();
    }

    if (!(await this.bcryptService.compare(data.password, userInfo.password))) {
      throw NotMatchPasswordException();
    }
    const accessToken = await this.createAccessToken(userInfo);
    const refreshToken = await this.createRefreshToken(userInfo);
    const hashedRefreshToken = await this.bcryptService.hash(refreshToken);

    await this.authRepository.editUserRefreshToken(
      userInfo.id,
      hashedRefreshToken,
      this.manager,
    );

    const result: PostSignInResponseDto = new PostSignInResponseDto();
    result.accessToken = accessToken;
    result.refreshToken = refreshToken;
    result.email = userInfo.email;
    result.nickname = userInfo.nickname;
    result.role = userInfo.role;

    return result;
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
