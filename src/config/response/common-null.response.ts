import { ApiProperty } from '@nestjs/swagger';

export class CommonResponseNull {
  @ApiProperty({
    example: 'SUCCESS',
    description: 'api 성공 메시지',
    required: true,
  })
  message = 'SUCCESS';

  @ApiProperty({
    example: 200,
    description: 'http status 코드',
    required: true,
  })
  status: number;

  @ApiProperty({
    example: 2000,
    description: '성공 코드',
    required: true,
  })
  code = 2000;

  @ApiProperty({
    description: '결과 데이터는 null',
    example: null,
    nullable: true,
    type: 'null',
  })
  data: null;
}
