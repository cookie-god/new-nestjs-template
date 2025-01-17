import { ApiProperty } from '@nestjs/swagger';

export abstract class CommonResponse {
  @ApiProperty({
    example: 'SUCCESS',
    description: 'api 성공 메시지',
    required: true,
  })
  message: string;

  @ApiProperty({
    example: 200,
    description: 'http status 코드',
    required: true,
  })
  code: number;
}
