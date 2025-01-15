import { ApiProperty } from '@nestjs/swagger';

export class PostUsersResponseDto {
  @ApiProperty({
    example: 1,
    description: '소셜 로그인 아이디',
    required: true,
  })
  id: number;
  @ApiProperty({
    example: 'cookie-god@softsquared.com',
    description: '이메일',
    required: true,
  })
  email: string;
}
