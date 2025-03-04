import type { BunRequest } from "../routes/router";
import { UserProfileService } from "../services/UserProfileService";

export class UserProfileController {
  private userProfileService = new UserProfileService();

  async create(request: BunRequest) {
    return await this.userProfileService.createProfile(request);
  }

  async update(request: BunRequest) {
    return await this.userProfileService.updateProfile(request);
  }

  async delete(request: BunRequest) {
    return await this.userProfileService.deleteProfile(request);
  }
}
