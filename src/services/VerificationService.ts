import { BaseService } from './BaseService';
import { VerificationSchema } from '../models/schemas/VerificationSchema';
import { UserProfileSchema } from '../models/schemas/UserProfileSchema';
import type { VerificationEntity } from '../forms/verification';
import { JwtService } from '../common/JWTService';
import type { BunRequest } from '../routes/router';
import HttpResponse from '../common/HttpResponse';

export class VerificationService extends BaseService<VerificationEntity> {
  private userProfileService: BaseService<any>;

  constructor() {
    super(VerificationSchema);
    this.userProfileService = new BaseService(UserProfileSchema);
  }

  async createVerification(request: BunRequest) {
    try {
      // Extract user ID from JWT
      const authUserId = new JwtService(request).getCurrentUserId();
      if (!authUserId) return HttpResponse.failure("Unauthorized", 401);

      const { user_type, document_type, document_url, verification_data } = (await request.json()) as {
        user_type: VerificationEntity["user_type"];
        document_type: VerificationEntity["document_type"];
        document_url: string;
        verification_data?: Record<string, any>;
      };

      // Check if user exists in user_profiles
      const userExists = await this.userProfileService.findByField("auth_user_id", authUserId);
      if (!userExists) {
        return HttpResponse.failure("User profile not found", 404);
      }

      // Check if a verification request already exists for this user
      const existingVerification = await this.findByField("auth_user_id", authUserId);
      if (existingVerification) {
        return HttpResponse.failure("Verification request already exists", 409);
      }

      // Create new verification record
      const verification = await this.create({
        auth_user_id: authUserId,
        user_type,
        document_type,
        document_url,
        status: "Pending",
        verification_data,
      });

      return HttpResponse.success("Verification request submitted successfully", verification);
    } catch (error) {
      console.error("Error creating verification:", error);
      return HttpResponse.failure("Failed to create verification", 500);
    }
  }

  async approveVerification(request: BunRequest) {
    try {
      // Extract admin user ID from JWT
      const adminUserId = new JwtService(request).getCurrentUserId();
      if (!adminUserId) return HttpResponse.failure("Unauthorized", 401);
  
      // Extract request data
      const { verificationId, status } = (await request.json()) as {
        verificationId: string;
        status: "Approved" | "Rejected";
      };
  
      if (!["Approved", "Rejected"].includes(status)) {
        return HttpResponse.failure("Invalid status value", 400);
      }
  
      // Check if verification request exists
      const verification = await this.findById(verificationId);
      if (!verification) {
        return HttpResponse.failure("Verification request not found", 404);
      }
  
      // Update verification request status
      await this.update(verificationId, { status });
  
      // Update user profile verification_status
      await this.userProfileService.update(verification.auth_user_id, {
        verification_status: status,
      });
  
      return HttpResponse.success(`Verification ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error("Error approving verification:", error);
      return HttpResponse.failure("Failed to approve verification", 500);
    }
  }  
}
