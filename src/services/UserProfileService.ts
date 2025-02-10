import { BaseService } from './BaseService';
import { UserProfileSchema } from '../models/schemas';
import { type UserProfileEntity } from '../forms/userProfile';

export class UserProfileService extends BaseService<UserProfileEntity> {
  constructor() {
    super(UserProfileSchema);
  }
}
