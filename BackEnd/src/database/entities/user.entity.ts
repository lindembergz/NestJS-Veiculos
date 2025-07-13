import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('Users')
export class User extends BaseEntity {
  @Column({ length: 100, unique: true })
  username: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column({ length: 255, nullable: true })
  emailConfirmationToken: string;

  @Column({ default: false })
  isTwoFactorEnabled: boolean;

  @Column({ length: 20, nullable: true })
  twoFactorCode: string;

  @Column({ nullable: true })
  twoFactorCodeExpiryTime: Date;

  @Column({ length: 255, nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  refreshTokenExpiryTime: Date;
}
