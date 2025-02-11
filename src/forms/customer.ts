import { type UserProfileEntity } from './userProfile';

export interface CustomerEntity {
    id: string;
    auth_user_id: string;
    location?: string;
    resident_permit?: string;
    passport?: string;
    student_id?: string;
    notification_preferences: string;
    created_at: Date;
    updated_at: Date;
    user_profile?: UserProfileEntity;
  }