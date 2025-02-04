import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { type BusinessType } from './types';
import { User } from './User';

@Entity('business_profiles')
export class BusinessProfile extends BaseModel {
  @Column()
  businessName!: string;

  @Column({
    type: 'enum',
    enum: ['INDIVIDUAL', 'COMPANY', 'PARTNERSHIP']
  })
  businessType!: BusinessType;

  @Column({ nullable: true })
  registrationNumber?: string;

  @Column({ nullable: true })
  taxId?: string;

  @Column('jsonb')
  businessAddress!: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };

  @Column({ nullable: true })
  businessLogo?: string;

  @Column({ nullable: true })
  businessDescription?: string;

  @Column('jsonb', { nullable: true })
  operatingHours?: {
    [key: string]: {
      open: string;
      close: string;
    };
  };

  @Column('jsonb')
  contactPerson!: {
    name: string;
    position: string;
    email: string;
    phone: string;
  };

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @OneToOne(() => User, user => user.businessProfile)
  @JoinColumn()
  user!: User;

  @Column()
  userId!: number;
}