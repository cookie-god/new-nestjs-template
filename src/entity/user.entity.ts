import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ROLE } from 'src/enums/role.enum';

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

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  refreshToken: string;

  static from(email: string, password: string, nickname: string): UserInfo {
    const entity: UserInfo = new UserInfo();
    entity.id = null;
    entity.email = email;
    entity.password = password;
    entity.nickname = nickname;
    entity.role = ROLE.USER;
    return entity;
  }
}
