import { BaseService } from "./BaseService";
import { UserProfileSchema } from "../models/schemas";
import { type UserProfileEntity } from "../forms/userProfile";
import { BusinessService } from "./BusinessService";
import { RiderService } from "./RiderService";
import { CustomerService } from "./CustomerService";
import HttpResponse from "../common/HttpResponse";
import { JwtService } from "../common/JWTService";
import type { BunRequest } from "../routes/router";

export class UserProfileService extends BaseService<UserProfileEntity> {
  constructor() {
    super(UserProfileSchema);
  }

  async createProfile(request: BunRequest) {
    try {
      const authUserId = new JwtService(request).getCurrentUserId();
      const { user_type, profile_picture, profileData } = (await request.json()) as {
        user_type: UserProfileEntity["user_type"];
        profile_picture: string;
        profileData: Record<string, unknown>;
      };

      if (!["Business", "Rider", "Customer"].includes(user_type)) {
        return HttpResponse.failure("Invalid user type", 400);
      }

      const existingProfile = await this.findByField("auth_user_id", authUserId);
      if (existingProfile) {
        return HttpResponse.failure("User profile already exists", 409);
      }

      if (!profile_picture || typeof profile_picture !== "string") {
        return HttpResponse.failure("Profile picture is required", 400);
      }

      if (!profileData || typeof profileData !== "object") {
        return HttpResponse.failure(`Invalid ${user_type.toLowerCase()} profile data`, 400);
      }

      const userProfile = await this.create({
        auth_user_id: authUserId,
        user_type,
        profile_picture,
        verification_status: "Pending"
      });

      const profileService = {
        Business: new BusinessService(),
        Rider: new RiderService(),
        Customer: new CustomerService(),
      }[user_type];

      const userTypeInfo = await profileService.create({
        ...profileData,
        auth_user_id: authUserId,
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
      const authUserId = new JwtService(request).getCurrentUserId();
      const { user_type, profile_picture, profileData } = (await request.json()) as {
        user_type: UserProfileEntity["user_type"];
        profile_picture?: string;
        profileData?: Record<string, unknown>;
      };

      if (!user_type || !["Business", "Rider", "Customer"].includes(user_type)) {
        return HttpResponse.failure("Invalid or missing user type", 400);
      }

      const existingProfile = await this.findByField('auth_user_id', authUserId);
      if (!existingProfile) {
        return HttpResponse.failure("User profile not found", 404);
      }

      const updates: Partial<UserProfileEntity> = {};
      if (profile_picture) updates.profile_picture = profile_picture;

      if (Object.keys(updates).length > 0) {
        await this.update(authUserId, updates);
      }

      const profileServiceMap = {
        Business: new BusinessService(),
        Rider: new RiderService(),
        Customer: new CustomerService(),
      };

      const profileService = profileServiceMap[user_type];
      let updatedUserTypeInfo = null;

      if (profileData && Object.keys(profileData).length > 0) {
        updatedUserTypeInfo = await profileService.update(authUserId, profileData);
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
      const authUserId = new JwtService(request).getCurrentUserId();
      const existingProfile = await this.findByField("auth_user_id", authUserId);
      if (!existingProfile) {
        return HttpResponse.failure("User profile not found", 404);
      }

      const profileService = {
        Business: new BusinessService(),
        Rider: new RiderService(),
        Customer: new CustomerService(),
      }[existingProfile.user_type];

      if (profileService) {
        await profileService.delete(authUserId);
      }

      await this.delete(authUserId);
      return HttpResponse.success("Profile deleted successfully");
    } catch (error) {
      console.error("Error deleting profile:", error);
      return HttpResponse.failure("Failed to delete profile", 500);
    }
  }
}
