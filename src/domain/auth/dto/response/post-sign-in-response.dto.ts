import { ApiProperty } from '@nestjs/swagger';
import { ROLE } from 'src/enums/role.enum';

export class PostSignInResponseDto {
  @ApiProperty({
    example: 'token',
    description: 'access token',
    required: true,
  })
  accessToken: string;

  @ApiProperty({
    example: 'token',
    description: 'refresh token',
    required: true,
  })
  refreshToken: string;

  @ApiProperty({
    example: 'lion0193@gmail.com',
    description: '이메일',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: '쿠키',
    description: '닉네임',
    required: true,
  })
  nickname: string;

  @ApiProperty({
    example: 'USER',
    description: '유저 권한',
    required: true,
  })
  role: string;
}
