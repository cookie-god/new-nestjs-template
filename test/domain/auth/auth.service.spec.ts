import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';
import { PostSignInRequestDto } from '../../../src/domain/auth/dto/request/post-sign-in-request.dto';
import { BcryptService } from '../../../src/bcrypt/bcrypt.service';
import { AuthRepository } from '../../../src/domain/auth/auth.repository';
import { AuthService } from '../../../src/domain/auth/auth.service';
import { PostSignUpRequestDto } from '../../../src/domain/auth/dto/request/post-sign-up-request.dto';
import {
  DuplicateEmailException,
  DuplicateNicknameException,
  NotExistUserException,
  NotMatchPasswordException,
} from '../../../src/config/exception/service.exception';
import { UserInfo } from '../../../src/entity/user.entity';
import { PostSignUpResponseDto } from '../../../src/domain/auth/dto/response/post-sign-up-response.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: AuthRepository;
  let jwtService: JwtService;
  let bcryptService: BcryptService;
  let configService: ConfigService;

  const queryRunnerMock = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {} as EntityManager,
  }; // query runner 에서 사용하는 메서드들을 mock으로 생성

  const dataSourceMock = {
    createQueryRunner: jest.fn().mockReturnValue(queryRunnerMock),
  }; // dataSource 사용시 필요한 query runner 객체를 mock으로 생성

  const moduleRefMock = {
    get: jest.fn().mockImplementation((token: any) => {
      if (token === DataSource) return dataSourceMock;
      return null;
    }),
  }; // 트랜잭셔널 내부 dataSource 가져오는 mock 객체

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
