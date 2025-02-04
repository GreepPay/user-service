export interface CreateUserProfileForm {
    name: string;
    email: string;
    phoneNumber?: string;
    businessName?: string;
    businessType?: 'INDIVIDUAL' | 'COMPANY' | 'PARTNERSHIP';
    businessAddress?: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
    metadata?: Record<string, any>;
  }
  
  export interface UpdateUserProfileForm {
    name?: string;
    phoneNumber?: string;
    businessName?: string;
    businessAddress?: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
    metadata?: Record<string, any>;
  }
  
  export interface UploadDocumentForm {
    type: 'IDENTITY' | 'BUSINESS_LICENSE' | 'VEHICLE_REGISTRATION' | 'INSURANCE' | 'OTHER';
    metadata?: Record<string, any>;
  }
  
  export interface VerificationRequestForm {
    userType: 'business' | 'rider';
    documents?: UploadDocumentForm[];
  }
  
  // Response Forms
  export interface UserProfileResponse {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    status: string;
    businessProfile?: BusinessProfileResponse;
    riderProfile?: RiderProfileResponse;
  }
  
  export interface BusinessProfileResponse {
    id: number;
    businessName: string;
    businessType: string;
    businessAddress?: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
    verificationStatus?: string;
  }
  
  export interface RiderProfileResponse {
    id: number;
    vehicleType?: string;
    vehicleInfo?: {
      make: string;
      model: string;
      year: number;
      color: string;
      plateNumber: string;
    };
    verificationStatus?: string;
  }