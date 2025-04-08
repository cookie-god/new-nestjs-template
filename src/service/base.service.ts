import { ModuleRef } from '@nestjs/core';
import { DBServerException } from 'src/config/exception/service.exception';
import { EntityManager } from 'typeorm';

export class BaseService {
  protected manager: EntityManager;

  constructor(protected readonly moduleRef: ModuleRef) {}

  protected getManager(): EntityManager {
    if (!this.manager) {
      throw DBServerException();
    }
    return this.manager;
  }
}
