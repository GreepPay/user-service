import { BaseService } from './BaseService';
import { VerificationSchema } from '../models/schemas/VerificationSchema';
import type { VerificationEntity } from '../forms/verification';

export class VerificationService extends BaseService<VerificationEntity> {
  constructor() {
    super(VerificationSchema);
  }
}