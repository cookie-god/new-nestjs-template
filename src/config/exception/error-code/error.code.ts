export class ErrorCodeVo {
  readonly status: number;
  readonly code: number;
  readonly message: string;

  constructor(status: number, code: number, message: string) {
    this.status = status;
    this.code = code;
    this.message = message;
  }
}

export type ErrorCode = ErrorCodeVo;

export const NOT_EXIST_USER = new ErrorCodeVo(404, 4000, 'not exist user');
export const NOT_EXIST_ACCESS_TOKEN = new ErrorCodeVo(
  400,
  4001,
  'not exist access token',
);
export const NOT_EXIST_REFRESH_TOKEN = new ErrorCodeVo(
  400,
  4002,
  'not exist refresh token',
);
export const INVALID_ACCESS_TOKEN = new ErrorCodeVo(
  401,
  4003,
  'invalid access token',
);
export const INVALID_REFRESH_TOKEN = new ErrorCodeVo(
  401,
  4004,
  'invalid refresh token',
);
export const EXPIRED_ACCESS_TOKEN = new ErrorCodeVo(
  401,
  4005,
  'expired access token',
);
export const EXPIRED_REFRESH_TOKEN = new ErrorCodeVo(
  401,
  4006,
  'expired refresh token',
);

export const NOT_EXIST_EMAIL = new ErrorCodeVo(400, 4050, 'not exist email');
export const INVALID_EMAIL = new ErrorCodeVo(400, 4051, 'invalid email');
export const NOT_EXIST_PASSWORD = new ErrorCodeVo(
  400,
  4052,
  'not exist password',
);
export const INVALID_PASSWORD = new ErrorCodeVo(400, 4053, 'invalid password');
export const NOT_EXIST_NICKNAME = new ErrorCodeVo(
  400,
  4054,
  'not exist nickname',
);
export const INVALID_NICKNAME = new ErrorCodeVo(400, 4055, 'invalid nickname');
export const NOT_EXIST_ROLE = new ErrorCodeVo(400, 4056, 'not exist role');
export const INVALID_ROLE = new ErrorCodeVo(400, 4057, 'invalid role');
export const DUPLICATE_EMAIL = new ErrorCodeVo(404, 4058, 'duplicate email');
export const DUPLICATE_NICKNAME = new ErrorCodeVo(
  404,
  4059,
  'duplicate nickname',
);
export const NOT_MATCH_PASSWORD = new ErrorCodeVo(
  404,
  4060,
  'not match password',
);

export const DB_SERVER_ERROR = new ErrorCodeVo(500, 5002, 'DB server error');

export const FAIL_SERVICE_CALL = new ErrorCodeVo(
  500,
  5001,
  'service call fail',
);
export const INTERNAL_SERVER_ERROR = new ErrorCodeVo(
  500,
  5000,
  'internal server error',
);
