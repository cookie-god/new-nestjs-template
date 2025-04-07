import { ApiProperty } from '@nestjs/swagger';
import { ROLE } from 'src/enums/role.enum';

export class PostSignUpResponseDto {
  @ApiProperty({
    example: 1,
    description: '유저 아이디',
    required: true,
  })
  id: number;

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
