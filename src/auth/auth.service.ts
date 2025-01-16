import * as process from 'node:process';

import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import {
  FailServiceCallException,
  InternalServiceException,
} from 'src/config/exception/service.exception';
import { KakaoUserResponse } from 'src/auth/interface/kakao-user.interface';
import { PostUsersResponseDto } from './dto/response/post-users.response.dto';

import { PostKakaoLoginTestRequestDto } from './dto/request/post-kakao-login-test.request.dto';
import { PostKakaoLoginRequestDto } from './dto/request/post-kakao-login.request.dto';
import { UserInfo } from 'src/entity/user.entity';
import { AuthRepository } from './auth.repository';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly httpService: HttpService,
    private dataSource: DataSource,
  ) {}

  async retrieveAccessToken(
    kakaoAuthResCode: string,
  ): Promise<PostUsersResponseDto> {
    const accessToken: string =
      await this.getKakaoAccessToken(kakaoAuthResCode);
    console.log(accessToken);
    const kakaoUserResponse: KakaoUserResponse =
      await this.getKakaoUserInfo(accessToken);
    return {
      id: kakaoUserResponse.id,
    } as PostUsersResponseDto;
  }

  async retrieveSnsId(
    postKakaoLoginTestRequest: PostKakaoLoginTestRequestDto,
  ): Promise<PostUsersResponseDto> {
    const accessToken: string = postKakaoLoginTestRequest.accessToken;
    const kakaoUserResponse: KakaoUserResponse =
      await this.getKakaoUserInfo(accessToken);
    return {
      id: kakaoUserResponse.id,
    } as PostUsersResponseDto;
  }

  async kakaoLogin(
    postKakaoLoginRequest: PostKakaoLoginRequestDto,
  ): Promise<UserInfo> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const kakaoUserResponse: KakaoUserResponse = await this.getKakaoUserInfo(
        postKakaoLoginRequest.accessToken,
      );

      let userInfo: UserInfo | null = await this.authRepository.findUserBySnsId(
        kakaoUserResponse.id,
        queryRunner.manager,
      );

      if (userInfo) {
        console.log('already exist');
      } else {
        userInfo = await this.authRepository.saveUser(
          this.makeUserInfoEntity(kakaoUserResponse.id),
          queryRunner.manager,
        );
      }
      await queryRunner.commitTransaction();

      return userInfo;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw InternalServiceException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  makeUserInfoEntity(snsId: number): UserInfo {
    // const now: Date = new Date();
    return {
      id: null,
      snsType: 'kakao',
      snsId: snsId,
    } as UserInfo;
  }

  async getKakaoAccessToken(code: string): Promise<string> {
    const kakaoUrl = 'https://kauth.kakao.com/oauth/token';
    const payload = {
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_REST_API_KEY,
      redirect_uri: process.env.KAKAO_REDIRECT_URI,
      code: code,
    };
    const response = await firstValueFrom(
      this.httpService.post(kakaoUrl, null, {
        params: payload,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    );
    return response.data.access_token;
  }

  async getKakaoUserInfo(accessToken: string): Promise<KakaoUserResponse> {
    try {
      const kakaoUrl = 'https://kapi.kakao.com/v2/user/me';
      const response = await firstValueFrom(
        this.httpService.get(kakaoUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      throw FailServiceCallException();
    }
  }
}
