import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { EmailRegex, PasswordRegex } from 'src/config/regex/regex';
import { IsNotBlank } from 'src/decorator/class-validator/is-not-blank.decorator';

export class PostSignInRequestDto {
  @ApiProperty({
    example: 'lion0193@gmail.com',
    description: '이메일',
    required: true,
  })
  @IsNotBlank({ message: 'NOT_EXIST_EMAIL' })
  @Matches(EmailRegex, { message: 'INVALID_EMAIL' })
  email: string;

  @ApiProperty({
    example: 'qwer1234!',
    description: '비밀번호 (영문, 숫자, 특수문자 포함이 되어야 하고, 8~15자)',
    required: true,
  })
  @IsNotBlank({ message: 'NOT_EXIST_PASSWORD' })
  @Matches(PasswordRegex, {
    message: 'INVALID_PASSWORD',
  })
  password: string;
}
