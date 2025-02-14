import { BaseService } from "./BaseService";
import { UserProfileSchema } from "../models/schemas";
import { type UserProfileEntity } from "../forms/userProfile";
import { BusinessService } from "./BusinessService";
import { RiderService } from "./RiderService";
import { CustomerService } from "./CustomerService";
import HttpResponse from "../common/HttpResponse";
import type { BunRequest } from "../routes/router";

export class UserProfileService extends BaseService<UserProfileEntity> {
  constructor() {
    super(UserProfileSchema);
  }

  async createProfile(request: BunRequest) {
    try {
      const { auth_user_id, user_type, profile_picture, profileData } = (await request.json()) as {
        auth_user_id: string;
        user_type: UserProfileEntity["user_type"];
        profile_picture: string;
        profileData: Record<string, unknown>;
      };
  
      // Ensure auth_user_id is provided
      if (!auth_user_id || typeof auth_user_id !== "string") {
        return HttpResponse.failure("auth_user_id is required", 400);
      }
  
      // Validate user_type
      if (!["Business", "Rider", "Customer"].includes(user_type)) {
        return HttpResponse.failure("Invalid user type", 400);
      }
  
      // Check if profile already exists
      const existingProfile = await this.findByField("auth_user_id", auth_user_id);
      if (existingProfile) {
        return HttpResponse.failure("User profile already exists", 409);
      }
  
      // Validate profile_picture
      if (!profile_picture || typeof profile_picture !== "string") {
        return HttpResponse.failure("Profile picture is required", 400);
      }
  
      // Validate profileData
      if (!profileData || typeof profileData !== "object") {
        return HttpResponse.failure(`Invalid ${user_type.toLowerCase()} profile data`, 400);
      }
  
      // Create user profile
      const userProfile = await this.create({
        auth_user_id,
        user_type,
        profile_picture,
        verification_status: "Pending",
      });
  
      // Choose the correct service based on user_type
      const profileService = {
        Business: new BusinessService(),
        Rider: new RiderService(),
        Customer: new CustomerService(),
      }[user_type];
  
      // Create specific user type profile
      const userTypeInfo = await profileService.create({
        ...profileData,
        auth_user_id,
      });
  
      return HttpResponse.success("Profile created successfully", {
        ...userProfile,
        profile: userTypeInfo,
      });
  
    } catch (error) {
      console.error(error);
      return HttpResponse.failure("Failed to create profile", 500);
    }
  }
  

  async updateProfile(request: BunRequest) {
    try {
      // Parse request body
      const { auth_user_id, user_type, profile_picture, profileData } = (await request.json()) as {
        auth_user_id: string;
        user_type: UserProfileEntity["user_type"];
        profile_picture?: string;
        profileData?: Record<string, unknown>;
      };
  
      // Ensure auth_user_id is provided
      if (!auth_user_id || typeof auth_user_id !== "string") {
        return HttpResponse.failure("auth_user_id is required", 400);
      }
  
      // Validate user_type
      if (!user_type || !["Business", "Rider", "Customer"].includes(user_type)) {
        return HttpResponse.failure("Invalid or missing user type", 400);
      }
  
      // Check if profile exists
      const existingProfile = await this.findByField("auth_user_id", auth_user_id);
      if (!existingProfile) {
        return HttpResponse.failure("User profile not found", 404);
      }
  
      // Prepare update data
      const updates: Partial<UserProfileEntity> = {};
      if (profile_picture) updates.profile_picture = profile_picture;
  
      if (Object.keys(updates).length > 0) {
        await this.update(auth_user_id, updates);
      }
  
      // Map profile service based on user_type
      const profileServiceMap = {
        Business: new BusinessService(),
        Rider: new RiderService(),
        Customer: new CustomerService(),
      };
  
      const profileService = profileServiceMap[user_type];
      let updatedUserTypeInfo = null;
  
      // Update specific profile data
      if (profileData && Object.keys(profileData).length > 0) {
        updatedUserTypeInfo = await profileService.update(auth_user_id, profileData);
      }
  
      return HttpResponse.success("Profile updated successfully", {
        ...existingProfile,
        profile: updatedUserTypeInfo || existingProfile,
      });
  
    } catch (error) {
      console.error(error);
      return HttpResponse.failure("Failed to update profile", 500);
    }
  }
   

  async deleteProfile(request: BunRequest) {
    try {
      // Parse request body
      const { auth_user_id } = (await request.json()) as { auth_user_id: string };
  
      // Ensure auth_user_id is provided
      if (!auth_user_id || typeof auth_user_id !== "string") {
        return HttpResponse.failure("auth_user_id is required", 400);
      }
  
      // Check if profile exists
      const existingProfile = await this.findByField("auth_user_id", auth_user_id);
      if (!existingProfile) {
        return HttpResponse.failure("User profile not found", 404);
      }
  
      // Get corresponding profile service
      const profileServiceMap = {
        Business: new BusinessService(),
        Rider: new RiderService(),
        Customer: new CustomerService(),
      };
  
      const profileService = profileServiceMap[existingProfile.user_type];
  
      // Delete specific profile data
      if (profileService) {
        await profileService.delete(auth_user_id);
      }
  
      // Delete user profile
      await this.delete(auth_user_id);
      return HttpResponse.success("Profile deleted successfully");
  
    } catch (error) {
      console.error("Error deleting profile:", error);
      return HttpResponse.failure("Failed to delete profile", 500);
    }
  }
}  
