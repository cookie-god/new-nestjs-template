import { ApiProperty } from '@nestjs/swagger';

export class PostKakaoLoginTestRequestDto {
  @ApiProperty({
    example: 'token',
    description: '카카오 access token',
    required: true,
  })
  accessToken: string;
}
