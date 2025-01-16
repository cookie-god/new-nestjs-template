import {
  ErrorCode,
  FAIL_SERVICE_CALL,
  NOT_EXIST_USER,
} from './error-code/error.code';

export const NotExistUserException = (message?: string): ServiceException => {
  return new ServiceException(NOT_EXIST_USER, message);
};

export const FailServiceCallException = (
  message?: string,
): ServiceException => {
  return new ServiceException(FAIL_SERVICE_CALL, message);
};

export class ServiceException extends Error {
  readonly errorCode: ErrorCode;

  constructor(errorCode: ErrorCode, message?: string) {
    if (!message) {
      message = errorCode.message;
    }
    super(message);
    this.errorCode = errorCode;
  }
}
