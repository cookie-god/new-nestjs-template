import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';
import { NicknameRegex, PasswordRegex } from 'src/config/regex/regex';
import { IsNotBlank } from 'src/decorator/class-validator/is-not-blank.decorator';

export class PostSignUpRequestDto {
  @ApiProperty({
    example: 'lion0193@gmail.com',
    description: '이메일',
    required: true,
  })
  @IsNotBlank({ message: 'NOT_EXIST_EMAIL' })
  @IsEmail({}, { message: 'INVALID_EMAIL' })
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

  @ApiProperty({
    example: '쿠키',
    description: '닉네임',
    required: true,
  })
  @IsNotBlank({ message: 'NOT_EXIST_NICKNAME' })
  @Matches(NicknameRegex, {
    message: 'INVALID_NICKNAME',
  })
  nickname: string;
}
