import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

export interface TransactionalOptions {
  isolationLevel?: IsolationLevel;
}
