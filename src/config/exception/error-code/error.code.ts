class ErrorCodeVo {
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
export const INTERNAL_SERVER_ERROR = new ErrorCodeVo(
    500,
    'SERVER-ERROR-001',
    'internal server error',
);
