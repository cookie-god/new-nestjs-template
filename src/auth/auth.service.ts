import { Injectable } from '@nestjs/common';
import * as process from 'node:process';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { KakaoUserResponse } from '../users/interface/kakao-user.interface';
import { PostUsersResponseDto } from '../users/dto/response/post-users.response.dto';

@Injectable()
export class AuthService {
    constructor(
        private httpService: HttpService,
    ) {}

    async retrieveAccessToken(kakaoAuthResCode: string): Promise<PostUsersResponseDto> {
        const accessToken: string = await this.getKakaoAccessToken(kakaoAuthResCode);
        const kakaoUserResponse: KakaoUserResponse = await this.getKakaoUserInfo(accessToken);
        return {
            id: kakaoUserResponse.id,
            email: kakaoUserResponse.kakao_account.email
        } as PostUsersResponseDto;
    }

    async getKakaoAccessToken(code: string): Promise<string> {
        const kakaoUrl = 'https://kauth.kakao.com/oauth/token';
        const payload = {
            grant_type: 'authorization_code',
            client_id: process.env.KAKAO_REST_API_KEY,
            redirect_uri: process.env.KAKAO_REDIRECT_URI,
            code: code
        }
        const response = await firstValueFrom(this.httpService.post(kakaoUrl, null, {
            params: payload,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }));
        return response.data.access_token;
    }

    async getKakaoUserInfo(accessToken: string): Promise<KakaoUserResponse> {
        const kakaoUrl = 'https://kapi.kakao.com/v2/user/me';
        const response = await firstValueFrom(this.httpService.get(kakaoUrl, {
            headers: { Authorization: `Bearer ${accessToken}` }
        }));
        return response.data;
    }
}
