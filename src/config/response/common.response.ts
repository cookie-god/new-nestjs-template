import { ApiProperty } from '@nestjs/swagger';

export class CommonResponse<T> {
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
  status: number;

  @ApiProperty({
    description: '결과 데이터',
    required: true,
  })
  data: T;
}
