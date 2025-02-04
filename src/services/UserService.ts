// import { User } from '../models/User';

// export class UserService {
//   async getAllUsers(): Promise<User[]> {
//     return await User.find();
//   }

//   async createUser(name: string, email: string): Promise<User> {
//     const user = User.create({ name, email });
//     return await user.save();
//   }
// }
// src/services/UserService.ts

import { User } from '../models/User';
import { BusinessProfile } from '../models/BusinessProfile';
import HttpResponse, { type HttpResponseType } from '../common/HttpResponse';
import type { CreateUserProfileForm, UpdateUserProfileForm, VerificationRequestForm } from '../forms/user';
import { JwtService } from '../common/JWTService';

export class UserService {
  private jwtService: JwtService;

  constructor(request: Request) {
    this.jwtService = new JwtService(request);
  }

  async getUserProfile(userId: string): Promise<User | HttpResponseType> {
    try {
      const user = await User.findOne({
        where: { uuid: userId },
        relations: ['businessProfile', 'riderProfile', 'documents', 'verificationStatuses']
      });

      if (!user) {
        return HttpResponse.failure('User not found', 404);
      }

      return user;
    } catch (error) {
      return HttpResponse.failure('Failed to fetch user profile', 500);
    }
  }

  async createUserProfile(data: CreateUserProfileForm): Promise<User | HttpResponseType> {
    try {
      // Check if email is unique
      const existingUser = await User.findOne({ where: { email: data.email } });
      if (existingUser) {
        return HttpResponse.failure('User with email already exists', 400);
      }

      // Create user profile
      const user = new User();
      user.name = data.name;
      user.email = data.email;
      user.phone = data.phoneNumber;
      user.status = 'ACTIVE';

      await user.save();

      // Create business profile if business details provided
      if (data.businessName) {
        const businessProfile = new BusinessProfile();
        businessProfile.businessName = data.businessName;
        businessProfile.businessType = data.businessType!;
        businessProfile.businessAddress = data.businessAddress;
        businessProfile.user = user;
        
        await businessProfile.save();
      }

      return user;
    } catch (error) {
      return HttpResponse.failure('Failed to create user profile', 500);
    }
  }

  async updateUserProfile(
    userId: string,
    data: UpdateUserProfileForm
  ): Promise<User | HttpResponseType> {
    try {
      const user = await User.findOne({
        where: { uuid: userId },
        relations: ['businessProfile']
      });

      if (!user) {
        return HttpResponse.failure('User not found', 404);
      }

      // Update user fields
      if (data.name) user.name = data.name;
      if (data.phoneNumber) user.phone = data.phoneNumber;

      // Update business profile if exists
      if (user.businessProfile && (data.businessName || data.businessAddress)) {
        if (data.businessName) user.businessProfile.businessName = data.businessName;
        if (data.businessAddress) user.businessProfile.businessAddress = data.businessAddress;
        await user.businessProfile.save();
      }

      await user.save();
      return user;
    } catch (error) {
      return HttpResponse.failure('Failed to update user profile', 500);
    }
  }

  async requestVerification(
    userId: string,
    data: VerificationRequestForm
  ): Promise<User | HttpResponseType> {
    try {
      const user = await User.findOne({
        where: { uuid: userId },
        relations: ['verificationStatuses']
      });

      if (!user) {
        return HttpResponse.failure('User not found', 404);
      }

      // Check if verification request already exists
      const existingVerification = user.verificationStatuses?.find(
        vs => vs.userType === data.userType && vs.status === 'PENDING'
      );

      if (existingVerification) {
        return HttpResponse.failure('Verification request already pending', 400);
      }

      // Create new verification request
      // Add verification status handling here

      return user;
    } catch (error) {
      return HttpResponse.failure('Failed to request verification', 500);
    }
  }

  async uploadDocument(userId: string, fileData: any): Promise<HttpResponseType> {
    try {
      const user = await User.findOne({ where: { uuid: userId } });
      if (!user) {
        return HttpResponse.failure('User not found', 404);
      }

      // Handle file upload and document creation
      // Add document handling logic here

      return HttpResponse.success('Document uploaded successfully');
    } catch (error) {
      return HttpResponse.failure('Failed to upload document', 500);
    }
  }
}