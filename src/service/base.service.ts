import { ModuleRef } from '@nestjs/core';
import { EntityManager } from 'typeorm';

export class BaseService {
  protected manager: EntityManager;

  constructor(protected readonly moduleRef: ModuleRef) {}
}
