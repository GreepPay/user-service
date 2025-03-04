// schemas/UserProfileSchema.ts
import { EntitySchema } from 'typeorm';
import { type UserProfileEntity } from '../../forms/userProfile';

export const UserProfileSchema = new EntitySchema<UserProfileEntity>({
  name: 'UserProfile',
  columns: {
    auth_user_id: {
      primary: true,
      type: String,
      unique: true
    },
    user_type: {
      type: 'enum',
      enum: ['Business', 'Rider', 'Customer']
    },
    profile_picture: {
      type: String,
      nullable: true
    },
    verification_status: {
      type: 'enum',
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    created_at: {
      type: 'timestamp',
      createDate: true
    },
    updated_at: {
      type: 'timestamp',
      updateDate: true
    }
  }
});