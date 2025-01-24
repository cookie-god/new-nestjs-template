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
export const NOT_EXIST_JWT = new ErrorCodeVo(400, 4001, 'not exist jwt');
export const INVALID_JWT = new ErrorCodeVo(401, 4002, 'invalid jwt');
export const EXPIRED_JWT = new ErrorCodeVo(401, 4003, 'expired jwt');

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
