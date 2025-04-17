import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from '../../bcrypt/bcrypt.service';
import { PostSignUpRequestDto } from './dto/request/post-sign-up-request.dto';
import { UserInfo } from '../../entity/user.entity';
import { PostSignUpResponseDto } from './dto/response/post-sign-up-response.dto';
import { DataSource, EntityManager } from 'typeorm';
import {
  DuplicateEmailException,
  DuplicateNicknameException,
  NotExistUserException,
  NotMatchPasswordException,
} from '../../config/exception/service.exception';
import { PostSignInRequestDto } from './dto/request/post-sign-in-request.dto';
import { get } from 'http';

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: AuthRepository;
  let jwtService: JwtService;
  let bcryptService: BcryptService;
  let configService: ConfigService;

  // Mock 객체 선언
  const queryRunnerMock = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {} as EntityManager,
  };

  const dataSourceMock = {
    createQueryRunner: jest.fn().mockReturnValue(queryRunnerMock),
  };

  const moduleRefMock = {
    get: jest.fn().mockImplementation((token: any) => {
      if (token === DataSource) return dataSourceMock;
      return null;
    }),
  };

  beforeEach(async () => {
    authRepository = {
      isExistEmail: jest.fn(),
      isExistNickname: jest.fn(),
      saveUser: jest.fn(),
      findUserInfoByEmail: jest.fn(),
      editUserRefreshToken: jest.fn(),
    } as any;
    jwtService = {
      signAsync: jest.fn(),
    } as any;
    configService = {
      get: jest.fn(),
    } as any;
    bcryptService = {
      hash: jest.fn(),
      compare: jest.fn(),
      encrypt: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useFactory: () =>
            new AuthService(
              moduleRefMock as any,
              authRepository,
              jwtService,
              configService,
              bcryptService,
            ),
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
  });

  describe('회원가입', () => {
    it('duplicate email', async () => {
      const dto: PostSignUpRequestDto = {
        email: 'lion0193@gmail.com',
        password: 'password',
        nickname: 'nickname',
      };

      jest.spyOn(authRepository, 'isExistEmail').mockResolvedValue(true);

      await expect(authService.createUsers(dto)).rejects.toThrow(
        DuplicateEmailException(),
      );
    });

    it('duplicate nickname', async () => {
      const dto: PostSignUpRequestDto = {
        email: 'lion0193@gmail.com',
        password: 'password',
        nickname: 'nickname',
      };

      jest.spyOn(authRepository, 'isExistNickname').mockResolvedValue(true);

      await expect(authService.createUsers(dto)).rejects.toThrow(
        DuplicateNicknameException(),
      );
    });

    it('create user success', async () => {
      const request: PostSignUpRequestDto = {
        email: 'lion0193@gmail.com',
        password: 'password',
        nickname: 'nickname',
      };

      const hashedPassword = 'hashedPassword';
      const user: UserInfo = UserInfo.from(
        request.email,
        hashedPassword,
        request.nickname,
      );
      user.id = 1;

      jest.spyOn(authRepository, 'isExistEmail').mockResolvedValue(false);
      jest.spyOn(authRepository, 'isExistNickname').mockResolvedValue(false);
      jest.spyOn(bcryptService, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(authRepository, 'saveUser').mockResolvedValue(user);

      const response: PostSignUpResponseDto =
        await authService.createUsers(request);
      expect(response).toEqual({
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
      });
    });
  });

  describe('로그인', () => {
    it('not exist user', async () => {
      const request: PostSignInRequestDto = {
        email: 'lion0193@gmail.com',
        password: 'password',
      };

      jest.spyOn(authRepository, 'findUserInfoByEmail').mockResolvedValue(null);

      await expect(authService.login(request)).rejects.toThrow(
        NotExistUserException(),
      );
    });

    it('not match password', async () => {
      const request: PostSignInRequestDto = {
        email: 'lion0193@gmail.com',
        password: 'password',
      };
      const hashedPassword = 'hashedPassword';
      const user: UserInfo = UserInfo.from(
        request.email,
        hashedPassword,
        'nickname',
      );
      user.id = 1;

      jest.spyOn(authRepository, 'findUserInfoByEmail').mockResolvedValue(user);
      jest.spyOn(bcryptService, 'compare').mockResolvedValue(false);

      await expect(authService.login(request)).rejects.toThrow(
        NotMatchPasswordException(),
      );
    });

    it('login success', async () => {
      const request: PostSignInRequestDto = {
        email: 'lion0193@gmail.com',
        password: 'password',
      };
      const hashedPassword = 'hashedPassword';
      const user: UserInfo = UserInfo.from(
        request.email,
        hashedPassword,
        'nickname',
      );
      user.id = 1;

      jest.spyOn(authRepository, 'findUserInfoByEmail').mockResolvedValue(user); // promise 객체 리턴
      jest.spyOn(bcryptService, 'compare').mockResolvedValue(true);
      jest.spyOn(bcryptService, 'encrypt').mockReturnValue('encryptedId');
      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token'); // promise 객체 순서대로 호출되도록 하였음
      jest
        .spyOn(bcryptService, 'hash')
        .mockResolvedValue('hashed_refresh_token');
      jest
        .spyOn(authRepository, 'editUserRefreshToken')
        .mockResolvedValue(undefined);
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'ACCESS_TOKEN_SECRET_KEY') return 'access-secret';
        if (key === 'ACCESS_TOKEN_EXPIRE_DATE') return '1h';
        if (key === 'REFRESH_TOKEN_SECRET_KEY') return 'refresh-secret';
        if (key === 'REFRESH_TOKEN_EXPIRE_DATE') return '7d';
        return '';
      }); // 구체적인 실행 로직을 위해 mockImplementation 사용

      const response = await authService.login(request);
      expect(response).toEqual({
        email: user.email,
        nickname: user.nickname,
        role: user.role,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });
  });
});
