import { ModuleRef } from '@nestjs/core';
import { EntityManager } from 'typeorm';

export class BaseService {
  protected manager: EntityManager;

  constructor(protected readonly moduleRef: ModuleRef) {}

  protected getManager(): EntityManager {
    if (!this.manager)
      throw new Error('No EntityManager – did you forget @Transactional()?');
    return this.manager;
  }
}
