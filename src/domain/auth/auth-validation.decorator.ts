import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PostSignUpRequestDto } from './dto/request/post-sign-up-request.dto';
import {
  InvalidEmailException,
  InvalidNicknameException,
  InvalidPasswordException,
  NotExistEmailException,
  NotExistNicknameException,
  NotExistPasswordException,
} from 'src/config/exception/service.exception';
import {
  EmailRegex,
  NicknameRegex,
  PasswordRegex,
} from 'src/config/regex/regex';

export const PostSignUp = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const body: PostSignUpRequestDto = ctx.switchToHttp().getRequest().body;

    if (!body.email) {
      throw NotExistEmailException();
    }
    if (!EmailRegex.test(body.email)) {
      throw InvalidEmailException();
    }
    if (!body.password) {
      throw NotExistPasswordException();
    }
    if (!PasswordRegex.test(body.password)) {
      throw InvalidPasswordException();
    }
    if (!body.nickname) {
      throw NotExistNicknameException();
    }
    if (!NicknameRegex.test(body.nickname)) {
      throw InvalidNicknameException();
    }
    return body;
  },
);
