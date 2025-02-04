import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { type VehicleType } from './types';
import { User } from './User';

@Entity('rider_profiles')
export class RiderProfile extends BaseModel {
  @Column()
  dateOfBirth!: Date;

  @Column({ nullable: true })
  gender?: string;

  @Column({
    type: 'enum',
    enum: ['BICYCLE', 'MOTORCYCLE', 'CAR', 'VAN']
  })
  vehicleType!: VehicleType;

  @Column('jsonb', { nullable: true })
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    color: string;
    plateNumber: string;
  };

  @Column('jsonb', { nullable: true })
  deliveryPreferences?: {
    maxDistance?: number;
    preferredAreas?: string[];
    availableTimeSlots?: {
      [key: string]: {
        start: string;
        end: string;
      }[];
    };
  };

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @OneToOne(() => User, user => user.riderProfile)
  @JoinColumn()
  user!: User;

  @Column()
  userId!: number;
}