import { ApiProperty } from '@nestjs/swagger';

export class PostUsersResponseDto {
  @ApiProperty({
    example: 1,
    description: '소셜 로그인 아이디',
    required: true,
  })
  id: number;
}
