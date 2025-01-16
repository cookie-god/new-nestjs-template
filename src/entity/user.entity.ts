import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'USER_INFO' })
export class UserInfo extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'sns_type', type: 'varchar', length: 20, nullable: false })
  snsType: string;

  @Column({ name: 'sns_id', type: 'bigint', nullable: false })
  snsId: number;

  @Column({
    name: 'policy_agreement_date',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  policyAgreementDate: Date;

  @Column({
    name: 'terms_agreement_date',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  termsAgreementDate: Date;

  @Column({ name: 'fcm_token', type: 'varchar', length: 512, nullable: true })
  fcmToken?: string;

  @Column({ name: 'alarm_time', type: 'time', nullable: true })
  alarmTime?: string;

  @Column({ name: 'goal_page', type: 'int', nullable: true })
  goalPage?: number;
}
