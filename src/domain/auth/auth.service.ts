import { Injectable } from '@nestjs/common';
import { UserInfo } from 'src/entity/user.entity';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PostSignUpRequestDto } from './dto/request/post-sign-up-request.dto';
import {
  DuplicateEmailException,
  DuplicateNicknameException,
  NotExistRefreshTokenException,
  NotExistUserException,
  NotMatchPasswordException,
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
import { Transactional } from 'src/decorator/service/transactional.decorator';
import { ReadOnly } from 'src/decorator/service/readonly.decorator';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    moduleRef: ModuleRef,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly bcryptService: BcryptService,
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
    const manager = this.getManager(); // 트랜잭션 매니저

    // 이메일 중복 검사
    if (await this.authRepository.isExistEmail(data.email, manager)) {
      throw DuplicateEmailException();
    }

    // 닉네임 중복 검사
    if (await this.authRepository.isExistNickname(data.nickname, manager)) {
      throw DuplicateNicknameException();
    }

    // 유저 저장
    const userInfo: UserInfo = await this.authRepository.saveUser(
      UserInfo.from(
        data.email,
        await this.bcryptService.hash(data.password),
        data.nickname,
      ),
      manager,
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
    const manager = this.getManager(); // 트랜잭션 매니저

    const userInfo: UserInfo = await this.authRepository.findUserInfoByEmail(
      data.email,
      manager,
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
      manager,
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
