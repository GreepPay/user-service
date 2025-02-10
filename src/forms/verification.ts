import { type UserProfileEntity } from './userProfile';

export interface VerificationEntity {
    id: string;
    user_profile_id: string;
    user_type: 'Business' | 'Rider' | 'Customer';
    document_type: 'International Passport' | 'Resident Permit' | "Driver's License" | 'Student ID' | 'Passport';
    document_url: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    verification_data?: Record<string, any>;
    created_at: Date;
    updated_at: Date;
    user_profile?: UserProfileEntity;
  }