import type { BunRequest } from '../routes/router';
import { UserService } from '../services/UserService';
import HttpResponse from '../common/HttpResponse';
import { UserType, MediaType } from '../models/types/enums';
import type { UserTypeData, UserVendorData } from '../models/types/user';

export class UserController {
    async getUsers(request: BunRequest) {
        try {
            const url = new URL(request.url);
            const queryParams = {
                page: parseInt(url.searchParams.get('page') || '1'),
                limit: parseInt(url.searchParams.get('limit') || '10'),
                userType: url.searchParams.get('userType') as UserType || undefined,
                search: url.searchParams.get('search') || undefined,
                sortBy: url.searchParams.get('sortBy') || undefined,
                sortOrder: url.searchParams.get('sortOrder') as 'ASC' | 'DESC' || undefined
            };

            if (queryParams.limit && (queryParams.limit < 1 || queryParams.limit > 100)) {
                return HttpResponse.failure('Limit must be between 1 and 100', 400);
            }

            if (queryParams.page && queryParams.page < 1) {
                return HttpResponse.failure('Page must be greater than 0', 400);
            }

            const response = await new UserService(request).getUsers(queryParams);
            return HttpResponse.success('Users fetched successfully', response);
        } catch (error) {
            return HttpResponse.failure('Failed to process request', 400);
        }
    }

    async getUserProfile(request: BunRequest) {
        try {
            const authUserId = request.headers.get('auth-user-id');
            if (!authUserId) {
                return HttpResponse.failure('Unauthorized', 401);
            }

            const response = await new UserService(request).getUserProfile(authUserId);
            return HttpResponse.success('User profile fetched successfully', response);
        } catch (error) {
            return HttpResponse.failure('Failed to fetch user profile', 500);
        }
    }

    async updateUserProfile(request: BunRequest) {
        try {
            const authUserId = request.headers.get('auth-user-id');
            if (!authUserId) {
                return HttpResponse.failure('Unauthorized', 401);
            }

            const data = await request.json();
            const response = await new UserService(request).updateUserProfile(authUserId, data);
            return HttpResponse.success('User profile updated successfully', response);
        } catch (error) {
            return HttpResponse.failure('Failed to update user profile', 500);
        }
    }

    async updateUserType(request: BunRequest) {
        try {
            const authUserId = request.headers.get('auth-user-id');
            if (!authUserId) {
                return HttpResponse.failure('Unauthorized', 401);
            }

            const data = await request.json() as UserTypeData;
            if (!Object.values(UserType).includes(data.type)) {
                return HttpResponse.failure('Invalid user type', 400);
            }

            const response = await new UserService(request).updateUserType(authUserId, data);
            return HttpResponse.success('User type updated successfully', response);
        } catch (error) {
            return HttpResponse.failure('Failed to update user type', 500);
        }
    }

    async updateVendorData(request: BunRequest) {
        try {
            const authUserId = request.headers.get('auth-user-id');
            if (!authUserId) {
                return HttpResponse.failure('Unauthorized', 401);
            }

            const data = await request.json() as Partial<UserVendorData>;
            const response = await new UserService(request).updateVendorData(authUserId, data);
            return HttpResponse.success('Vendor data updated successfully', response);
        } catch (error) {
            return HttpResponse.failure('Failed to update vendor data', 500);
        }
    }

    async uploadMedia(request: BunRequest) {
        try {
            const authUserId = request.headers.get('auth-user-id');
            if (!authUserId) {
                return HttpResponse.failure('Unauthorized', 401);
            }

            const formData = await request.formData();
            const file = formData.get('file');
            const type = formData.get('type');

            if (!file || !(file instanceof File)) {
                return HttpResponse.failure('No file provided', 400);
            }

            if (!type || !Object.values(MediaType).includes(type as MediaType)) {
                return HttpResponse.failure('Invalid media type', 400);
            }

            // Validate file
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                return HttpResponse.failure('File size exceeds 5MB limit', 400);
            }

            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                return HttpResponse.failure('Invalid file type. Allowed types: JPG, PNG, PDF', 400);
            }

            const response = await new UserService(request).uploadMedia(
                authUserId,
                file,
                type as MediaType
            );
            
            return HttpResponse.success('Media uploaded successfully', response);
        } catch (error) {
            return HttpResponse.failure('Failed to upload media', 500);
        }
    }
}