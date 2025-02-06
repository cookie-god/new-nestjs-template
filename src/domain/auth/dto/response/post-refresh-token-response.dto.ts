import { ApiProperty } from '@nestjs/swagger';

export class PostAccessTokenResponseDto {
  @ApiProperty({
    example: 'token',
    description: 'access token',
    required: true,
  })
  accessToken: string;
}
