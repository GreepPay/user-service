// schemas/CustomerSchema.ts
import { EntitySchema } from 'typeorm';
import { type CustomerEntity } from '../../forms/customer';

export const CustomerSchema = new EntitySchema<CustomerEntity>({
  name: 'Customer',
  columns: {
    id: {
      type: String,
      primary: true,
      generated: 'uuid'
    },
    user_profile_id: {
      type: String,
      unique: true
    },
    location: {
      type: String,
      nullable: true
    },
    resident_permit: {
      type: String,
      nullable: true
    },
    passport: {
      type: String,
      nullable: true
    },
    student_id: {
      type: String,
      nullable: true
    },
    notification_preferences: {
      type: String,
      default: 'true'
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
      type: 'one-to-one',
      target: 'UserProfile',
      joinColumn: { name: 'user_profile_id' },
      onDelete: 'CASCADE'
    }
  }
});