import {
  ErrorCode,
  EXPIRED_JWT,
  FAIL_SERVICE_CALL,
  INTERNAL_SERVER_ERROR,
  INVALID_JWT,
  NOT_EXIST_JWT,
  NOT_EXIST_USER,
} from './error-code/error.code';

export const NotExistUserException = (message?: string): ServiceException => {
  return new ServiceException(NOT_EXIST_USER, message);
};

export const NotExistJWTException = (message?: string): ServiceException => {
  return new ServiceException(NOT_EXIST_JWT, message);
};

export const InvalidJWTException = (message?: string): ServiceException => {
  return new ServiceException(INVALID_JWT, message);
};

export const ExpiredJWTException = (message?: string): ServiceException => {
  return new ServiceException(EXPIRED_JWT, message);
};

export const FailServiceCallException = (
  message?: string,
): ServiceException => {
  return new ServiceException(FAIL_SERVICE_CALL, message);
};

export const InternalServiceException = (
  message?: string,
): ServiceException => {
  return new ServiceException(INTERNAL_SERVER_ERROR, message);
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
