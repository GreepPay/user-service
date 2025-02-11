
export interface UserProfileEntity {
    auth_user_id: string;
    user_type: 'Business' | 'Rider' | 'Customer';
    profile_picture?: string;
    verification_status: string;
    created_at: Date;
    updated_at: Date;
  }