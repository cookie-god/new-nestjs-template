export interface KakaoUserResponse {
    id: number;
    connected_at: string;
    properties?: {
        nickname?: string;
        profile_image?: string;
        thumbnail_image?: string;
    };
    kakao_account?: {
        profile?: {
            nickname?: string;
            profile_image_url?: string;
            thumbnail_image_url?: string;
        };
        email?: string;
        age_range?: string;
        birthday?: string;
        gender?: 'male' | 'female';
    };
}
