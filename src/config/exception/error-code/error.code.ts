export class ErrorCodeVo {
  readonly status: number;
  readonly code: string;
  readonly message: string;

  constructor(status: number, code: string, message: string) {
    this.status = status;
    this.code = code;
    this.message = message;
  }
}

export type ErrorCode = ErrorCodeVo;

export const NOT_EXIST_USER = new ErrorCodeVo(
  404,
  'USER-001',
  'not exist user',
);
export const NOT_EXIST_JWT = new ErrorCodeVo(400, 'AUTH-001', 'not exist jwt');
export const INVALID_JWT = new ErrorCodeVo(401, 'AUTH-002', 'invalid jwt');
export const EXPIRED_JWT = new ErrorCodeVo(401, 'AUTH-003', 'expired jwt');
export const FAIL_SERVICE_CALL = new ErrorCodeVo(
  500,
  'SERVER-ERROR-002',
  'service call fail',
);
export const INTERNAL_SERVER_ERROR = new ErrorCodeVo(
  500,
  'SERVER-ERROR-001',
  'internal server error',
);
