import { EntitySchema } from 'typeorm';
import { UserRankings } from '../types/enums';
import { type UserEntity } from '../types/user';

export const UserSchema = new EntitySchema<UserEntity>({
  name: 'User',
  columns: {
    id: {
      type: String,
      primary: true,
      generated: 'uuid'
    },
    bio: {
      type: 'jsonb',
      nullable: false,
      default: {
        username: '',
        email: '',
        name: {
          first: '',
          last: '',
          full: ''
        },
        photo: null,
        phone: null
      }
    },
    roles: {
      type: 'jsonb',
      nullable: false,
      default: {
        isAdmin: false,
        isDriver: false,
        isVendor: false,
        isCustomer: false
      }
    },
    dates: {
      type: 'jsonb',
      nullable: false,
      default: {
        createdAt: () => Date.now(),
        deletedAt: null
      }
    },
    status: {
      type: 'jsonb',
      nullable: false,
      default: {
        connections: [],
        lastUpdatedAt: () => Date.now()
      }
    },
    account: {
      type: 'jsonb',
      nullable: false,
      default: {
        rankings: Object.values(UserRankings).reduce((acc, key) => ({
          ...acc,
          [key]: { value: 0, lastUpdatedAt: Date.now() }
        }), {}),
        meta: {},
        ratings: {
          total: 0,
          count: 0,
          average: 0
        },
        application: null,
        trips: {},
        location: null,
        savedLocations: [],
        settings: {
          notifications: true,
          driverAvailable: false
        }
      }
    },
    typeData: {
      type: 'jsonb',
      nullable: true
    },
    vendorData: {
      type: 'jsonb',
      nullable: true
    }
  },
  indices: [
    { name: 'user_bio_email', columns: ['((bio->\'email\'))'], unique: true },
    { name: 'user_bio_username', columns: ['((bio->\'username\'))'], unique: true }
  ]
});