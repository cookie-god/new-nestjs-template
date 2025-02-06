import { ApiProperty } from '@nestjs/swagger';

export class PostSignInRequestDto {
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
}
