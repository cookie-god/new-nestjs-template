import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'USER_INFO' })
export class UserInfo extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'email', type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ name: 'nickname', type: 'varchar', length: 50, nullable: false })
  nickname: string;

  @Column({ name: 'role', type: 'varchar', length: 50, nullable: false })
  role: string;
}
