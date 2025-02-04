// import { UserService } from '../services/UserService';

// export class UserController {
//   private userService = new UserService();

//   async getAllUsers() {
//     return await this.userService.getAllUsers();
//   }

//   async createUser(body: { name: string; email: string }) {
//     const { name, email } = body;
//     return await this.userService.createUser(name, email);
//   }
// }

import type { BunRequest } from '../routes/router';
import { UserService } from '../services/UserService';
import { User } from '../models/User';
import HttpResponse from '../common/HttpResponse';
import type { CreateUserProfileForm, UpdateUserProfileForm, VerificationRequestForm } from '../forms/user';

export class UserController {
  async getUserProfile(request: BunRequest) {
    const userId = request.params.id;
    const response = await new UserService(request).getUserProfile(userId);

    if (response instanceof User) {
      return HttpResponse.success('User profile fetched successfully', response);
    }

    return response;
  }

  async createUserProfile(request: BunRequest) {
    const data: CreateUserProfileForm = await request.json() as CreateUserProfileForm;
    const response = await new UserService(request).createUserProfile(data);

    if (response instanceof User) {
      return HttpResponse.success('User profile created successfully', response);
    }

    return response;
  }

  async updateUserProfile(request: BunRequest) {
    const userId = request.params.id;
    const data: UpdateUserProfileForm = await request.json() as UpdateUserProfileForm;
    const response = await new UserService(request).updateUserProfile(userId, data);

    if (response instanceof User) {
      return HttpResponse.success('User profile updated successfully', response);
    }

    return response;
  }

  async requestVerification(request: BunRequest) {
    const userId = request.params.id;
    const data: VerificationRequestForm = await request.json() as VerificationRequestForm;
    const response = await new UserService(request).requestVerification(userId, data);

    if (response instanceof User) {
      return HttpResponse.success('Verification requested successfully', response);
    }

    return response;
  }

  async uploadDocument(request: BunRequest) {
    const userId = request.params.id;
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return HttpResponse.failure('No file provided', 400);
    }

    const response = await new UserService(request).uploadDocument(userId, file);
    return response;
  }
}