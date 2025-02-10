import { EntitySchema } from 'typeorm';
import { type RiderEntity } from '../../forms/rider';

export const RiderSchema = new EntitySchema<RiderEntity>({
  name: 'Rider',
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
    license: {
      type: String
    },
    vehicle_type: {
      type: String
    },
    vehicle_registration_number: {
      type: String
    },
    vehicle_insurance: {
      type: String,
      nullable: true
    },
    experience_years: {
      type: String,
      nullable: true
    },
    availability_status: {
      type: String,
      default: 'true'
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