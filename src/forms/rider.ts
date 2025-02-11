import { type UserProfileEntity } from './userProfile';
 
 export interface RiderEntity {
    id: string;
    auth_user_id: string;
    location?: string;
    license: string;
    vehicle_type: string;
    vehicle_registration_number: string;
    vehicle_insurance?: string;
    experience_years?: string;
    availability_status: string;
    notification_preferences: string;
    created_at: Date;
    updated_at: Date;
    user_profile?: UserProfileEntity;
  }