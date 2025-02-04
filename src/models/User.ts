import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { BaseModel } from './BaseModel';
import { type UserStatus } from './types';
import { BusinessProfile } from './BusinessProfile';
import { RiderProfile } from './RiderProfile';
import { VerificationStatus } from './VerificationStatus';
import { Document } from './Document';

@Entity('users')
export class User extends BaseModel {
  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    default: 'ACTIVE'
  })
  status!: UserStatus;

  @Column({ default: 'en' })
  preferredLanguage!: string;

  @Column({ nullable: true })
  timezone?: string;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  // Relations
  @OneToOne(() => BusinessProfile, business => business.user, { nullable: true })
  businessProfile?: BusinessProfile;

  @OneToOne(() => RiderProfile, rider => rider.user, { nullable: true })
  riderProfile?: RiderProfile;

  @OneToMany(() => VerificationStatus, status => status.user)
  verificationStatuses!: VerificationStatus[];

  @OneToMany(() => Document, document => document.user)
  documents!: Document[];
}