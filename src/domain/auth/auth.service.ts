import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  FailServiceCallException,
  InternalServiceException,
} from 'src/config/exception/service.exception';
import { PostUsersResponseDto } from './dto/response/post-users.response.dto';

import { PostKakaoLoginTestRequestDto } from './dto/request/post-kakao-login-test-request.dto';
import { PostKakaoLoginRequestDto } from './dto/request/post-kakao-login-request.dto';
import { UserInfo } from 'src/entity/user.entity';
import { AuthRepository } from './auth.repository';
import { DataSource, QueryRunner } from 'typeorm';
import { payload } from './interface/user-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { PostKakaoLoginResponseDto } from './dto/response/post-kakao-login-response.dto';
import { plainToInstance } from 'class-transformer';
import { KakaoUserResponse } from './interface/kakao-user.interface';
import { HttpApiService } from '../http-api/http-api.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly httpApiService: HttpApiService,
    private readonly configService: ConfigService,
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
  ): Promise<PostKakaoLoginResponseDto> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 엑세스 토큰을 통해 카카오 정보 가져옴
      const kakaoUserResponse: KakaoUserResponse = await this.getKakaoUserInfo(
        postKakaoLoginRequest.accessToken,
      );
      let flag = false;

      // sns id를 토대로 DB로부터 유저 정보를 확인함
      let userInfo: UserInfo | null = await this.authRepository.findUserBySnsId(
        kakaoUserResponse.id,
        queryRunner.manager,
      );

      // 유저 정보가 존재한다면 로그인, 아니라면 회원가입
      if (!userInfo) {
        userInfo = await this.authRepository.saveUser(
          this.makeUserInfoEntity(kakaoUserResponse.id),
          queryRunner.manager,
        );
        flag = true; // 회원가입
      }

      // 페이로드 생성
      const payload: payload = {
        id: userInfo.id,
      };

      // jwt 생성
      const token = this.jwtService.sign(payload);

      await queryRunner.commitTransaction();

      return plainToInstance(PostKakaoLoginResponseDto, {
        token: token,
        goalPage: userInfo.goalPage,
        alarmTime: userInfo.alarmTime,
        flag: flag,
      });
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
    return plainToInstance(UserInfo, {
      id: null,
      snsType: 'kakao',
      snsId: snsId,
      goalPage: 0,
    });
  }

  /**
   * 인가 코드를 통해 엑세스 토큰을 가져오는 함수
   */
  async getKakaoAccessToken(code: string): Promise<string> {
    const kakaoUrl = 'https://kauth.kakao.com/oauth/token';
    const payload = {
      grant_type: 'authorization_code',
      client_id: this.configService.get<string>('KAKAO_REST_API_KEY'),
      redirect_uri: this.configService.get<string>('KAKAO_REDIRECT_URI'),
      code: code,
    };
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const response = await this.httpApiService.post<{ access_token: string }>(
      kakaoUrl,
      payload,
      headers,
    );
    return response.access_token;
  }

  /**
   * 엑세스 토큰을 통해 카카오 유저 정보를 가져오는 함수
   */
  async getKakaoUserInfo(accessToken: string): Promise<KakaoUserResponse> {
    const kakaoUrl = 'https://kapi.kakao.com/v2/user/me';
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return await this.httpApiService.get<KakaoUserResponse>(
      kakaoUrl,
      {},
      headers,
    );
  }
}
