import { type UserProfileEntity } from './userProfile';

export interface BusinessEntity {
    id: string;
    auth_user_id: string;
    logo?: string;
    location?: string;
    banner?: string;
    description?: string;
    website?: string;
    resident_permit?: string;
    passport?: string;
    registration_number?: string;
    created_at: Date;
    updated_at: Date;
    user_profile?: UserProfileEntity;
  }