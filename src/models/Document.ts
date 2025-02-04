import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseModel } from './BaseModel';
import type { DocumentType, DocumentStatus } from './types';
import { User } from './User';
import { VerificationStatus } from './VerificationStatus';

@Entity('documents')
export class Document extends BaseModel {
  @Column({
    type: 'enum',
    enum: ['IDENTITY', 'BUSINESS_LICENSE', 'VEHICLE_REGISTRATION', 'INSURANCE', 'OTHER']
  })
  type!: DocumentType;

  @Column()
  url!: string;

  @Column()
  mimeType!: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  })
  status!: DocumentStatus;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  // Updated relations
  @ManyToOne(() => User, user => user.documents)
  user!: User;

  @Column()
  userId!: number;

  @ManyToOne(() => VerificationStatus, verificationStatus => verificationStatus.documents)
  verificationStatus?: VerificationStatus;

  @Column({ nullable: true })
  verificationStatusId?: number;
}