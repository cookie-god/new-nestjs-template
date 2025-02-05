import {
  DUPLICATE_EMAIL,
  DUPLICATE_NICKNAME,
  ErrorCode,
  EXPIRED_JWT,
  FAIL_SERVICE_CALL,
  INTERNAL_SERVER_ERROR,
  INVALID_EMAIL,
  INVALID_JWT,
  INVALID_NICKNAME,
  INVALID_PASSWORD,
  INVALID_ROLE,
  NOT_EXIST_EMAIL,
  NOT_EXIST_JWT,
  NOT_EXIST_NICKNAME,
  NOT_EXIST_PASSWORD,
  NOT_EXIST_ROLE,
  NOT_EXIST_USER,
} from './error-code/error.code';

export const DuplicateNicknameException = (
  message?: string,
): ServiceException => {
  return new ServiceException(DUPLICATE_NICKNAME, message);
};

export const DuplicateEmailException = (message?: string): ServiceException => {
  return new ServiceException(DUPLICATE_EMAIL, message);
};

export const InvalidRoleException = (message?: string): ServiceException => {
  return new ServiceException(INVALID_ROLE, message);
};

export const NotExistRoleException = (message?: string): ServiceException => {
  return new ServiceException(NOT_EXIST_ROLE, message);
};

export const InvalidNicknameException = (
  message?: string,
): ServiceException => {
  return new ServiceException(INVALID_NICKNAME, message);
};

export const NotExistNicknameException = (
  message?: string,
): ServiceException => {
  return new ServiceException(NOT_EXIST_NICKNAME, message);
};

export const InvalidPasswordException = (
  message?: string,
): ServiceException => {
  return new ServiceException(INVALID_PASSWORD, message);
};

export const NotExistPasswordException = (
  message?: string,
): ServiceException => {
  return new ServiceException(NOT_EXIST_PASSWORD, message);
};

export const InvalidEmailException = (message?: string): ServiceException => {
  return new ServiceException(INVALID_EMAIL, message);
};

export const NotExistEmailException = (message?: string): ServiceException => {
  return new ServiceException(NOT_EXIST_EMAIL, message);
};

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
