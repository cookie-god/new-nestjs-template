import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('USER_INFO')
export class UserInfo extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  snsType: string;

  @Column({ type: 'bigint', nullable: false })
  snsId: number;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  policyAgreementDate: Date;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  termsAgreementDate: Date;

  @Column({ type: 'varchar', length: 512, nullable: true })
  fcmToken?: string;

  @Column({ type: 'time', nullable: true })
  alarmTime?: string;

  @Column({ type: 'int', nullable: true })
  goalPage?: number;
}
