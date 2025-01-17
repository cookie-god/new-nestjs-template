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

  /**
   * 인가 코드를 통해 엑세스 토큰을 가져오는 함수
   */
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

  /**
   * sns id를 가져오는 함수
   */
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

  /**
   * 유저 아이디를 토대로 유저 정보 가져오는 함수
   */
  async retrieveUserById(id: number): Promise<UserInfo> {
    return this.authRepository.findUserById(id);
  }

  /**
   * 카카오 로그인을 통해 회원가입 또는 로그인을 하는 함수
   */
  async kakaoLogin(
    postKakaoLoginRequest: PostKakaoLoginRequestDto,
  ): Promise<UserInfo> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 엑세스 토큰을 통해 카카오 정보 가져옴
      const kakaoUserResponse: KakaoUserResponse = await this.getKakaoUserInfo(
        postKakaoLoginRequest.accessToken,
      );

      // sns id를 토대로 DB로부터 유저 정보를 확인함
      let userInfo: UserInfo | null = await this.authRepository.findUserBySnsId(
        kakaoUserResponse.id,
        queryRunner.manager,
      );

      // 유저 정보가 존재한다면 로그인, 아니라면 회원가입
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

  /**
   * 유저 엔티티를 만들어주는 함수
   */
  makeUserInfoEntity(snsId: number): UserInfo {
    return {
      id: null,
      snsType: 'kakao',
      snsId: snsId,
    } as UserInfo;
  }

  /**
   * 인가 코드를 통해 엑세스 토큰을 가져오는 함수
   */
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

  /**
   * 엑세스 토큰을 통해 카카오 유저 정보를 가져오는 함수
   */
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
