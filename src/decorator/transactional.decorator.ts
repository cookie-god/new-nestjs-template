import {
  InternalServiceException,
  ServiceException,
} from 'src/config/exception/service.exception';
import { logger } from 'src/config/logger/logger';
import { DataSource } from 'typeorm';

export function Transactional() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const moduleRef = this['moduleRef'];
      const dataSource: DataSource = moduleRef.get(DataSource, {
        strict: false,
      });

      const queryRunner = dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        this['manager'] = queryRunner.manager;
        const result = await originalMethod.apply(this, args);
        await queryRunner.commitTransaction();
        return result;
      } catch (error) {
        logger.error(error, error);
        await queryRunner.rollbackTransaction();
        if (error instanceof ServiceException) {
          throw error;
        }
        throw InternalServiceException();
      } finally {
        await queryRunner.release();
      }
    };

    return descriptor;
  };
}
