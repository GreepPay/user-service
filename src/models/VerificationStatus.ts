import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import type { VerificationStatus as VerificationStatusType, UserType } from './types';
import { User } from './User';
import { Document } from './Document';

@Entity('verification_statuses')
export class VerificationStatus extends BaseModel {
  @Column()
  isVerified!: boolean;

  @Column({ nullable: true })
  verifiedAt?: Date;

  @Column()
  verificationProviderId!: string;

  @Column()
  verificationMethod!: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
    default: 'PENDING'
  })
  status!: VerificationStatusType;

  @Column({ nullable: true })
  rejectionReason?: string;

  @OneToMany(() => Document, document => document.verificationStatus)
  documents!: Document[];

  // Updated relation
  @ManyToOne(() => User, user => user.verificationStatuses)
  user!: User;

  @Column()
  userId!: number;

  @Column({
    type: 'enum',
    enum: ['business', 'rider']
  })
  userType!: UserType;
}