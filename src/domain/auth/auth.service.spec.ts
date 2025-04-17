import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from '../../bcrypt/bcrypt.service';

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: AuthRepository;
  let jwtService: JwtService;
  let bcryptService: BcryptService;
  let configService: ConfigService;
  let moduleRef: ModuleRef;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: authRepository,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: BcryptService,
          useValue: bcryptService,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: ModuleRef,
          useValue: moduleRef,
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
