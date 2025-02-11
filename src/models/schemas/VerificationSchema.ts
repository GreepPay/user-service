// schemas/VerificationSchema.ts
import { EntitySchema } from 'typeorm';
import { type VerificationEntity } from '../../forms/verification';

export const VerificationSchema = new EntitySchema<VerificationEntity>({
  name: 'Verification',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: 'increment'
    },
    auth_user_id: {
      type: String,
      unique: true
    },
    user_type: {
      type: 'enum',
      enum: ['Business', 'Rider', 'Customer']
    },
    document_type: {
      type: 'enum',
      enum: ['International Passport', 'Resident Permit', "Driver's License", 'Student ID']
    },
    document_url: {
      type: String
    },
    status: {
      type: 'enum',
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    verification_data: {
      type: 'json',
      nullable: true
    },
    created_at: {
      type: 'timestamp',
      createDate: true
    },
    updated_at: {
      type: 'timestamp',
      updateDate: true
    }
  },
  relations: {
    user_profile: {
      type: 'many-to-one',
      target: 'UserProfile',
      joinColumn: { name: 'auth_user_id' },
      onDelete: 'CASCADE'
    }
  }
});