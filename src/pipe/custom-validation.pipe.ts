import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import * as ErrorCodes from '../config/exception/error-code/error.code';
import { ServiceException } from 'src/config/exception/service.exception';

const VALIDATION_PRIORITY = [
  'isNotBlank',
  'isNotEmpty',
  'isEmail',
  'minLength',
  'maxLength',
  'matches',
];

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const findFirstConstraint = (errors: any[]): string | null => {
        for (const error of errors) {
          if (error.constraints) {
            const firstKey = VALIDATION_PRIORITY.find((key) =>
              Object.prototype.hasOwnProperty.call(error.constraints, key),
            );

            return (
              (firstKey && error.constraints[firstKey]) ||
              Object.values(error.constraints)[0]
            );
          }

          if (error.children && error.children.length > 0) {
            const nested = findFirstConstraint(error.children);
            if (nested) return nested;
          }
        }
        return null;
      };

      const messageKey = findFirstConstraint(errors) ?? 'Validation failed';

      const errorCode = (ErrorCodes as any)[messageKey];

      if (errorCode) {
        throw new ServiceException(errorCode);
      } else {
        throw new ServiceException(
          ErrorCodes.INTERNAL_SERVER_ERROR,
          messageKey,
        );
      }
    }

    return value;
  }

  private toValidate(metatype: new (...args: any[]) => any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype as any);
  }
}
