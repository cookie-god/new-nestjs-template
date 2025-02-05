import { ApiProperty } from '@nestjs/swagger';

export class PostSignUpRequestDto {
  @ApiProperty({
    example: 'lion0193@gmail.com',
    description: '이메일',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: 'qwer1234!',
    description: '비밀번호 (영문, 숫자, 특수문자 포함이 되어야 하고, 8~15자)',
    required: true,
  })
  password: string;

  @ApiProperty({
    example: '쿠키',
    description: '닉네임',
    required: true,
  })
  nickname: string;
}
