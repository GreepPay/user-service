// schemas/BusinessSchema.ts
import { EntitySchema } from 'typeorm';
import { type BusinessEntity } from '../../forms/business';

export const BusinessSchema = new EntitySchema<BusinessEntity>({
  name: 'Business',
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
    logo: {
      type: String,
      nullable: true
    },
    location: {
      type: String,
      nullable: true
    },
    banner: {
      type: String,
      nullable: true
    },
    description: {
      type: 'text',
      nullable: true
    },
    website: {
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
    registration_number: {
      type: String,
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
      type: 'one-to-one',
      target: 'UserProfile',
      joinColumn: { name: 'auth_user_id' },
      onDelete: 'CASCADE'
    }
  }
});