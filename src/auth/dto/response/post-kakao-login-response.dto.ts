import { ApiProperty } from '@nestjs/swagger';

export class PostKakaoLoginResponseDto {
  @ApiProperty({
    example: 'token',
    description: 'jwt 토큰',
    required: true,
  })
  token: string;

  @ApiProperty({
    example: 1,
    description: '목표 페이지. 설정한 경우 (1~3), 설정하지 않은 경우 0',
    required: true,
  })
  goalPage: number;

  @ApiProperty({
    example: '19:30:00',
    description:
      '알람 시간. 설정한 경우 hh:mm:ss 형식, 설정하지 않은 경우 null',
    required: true,
  })
  alarmTime: string;
}
