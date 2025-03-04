import { BaseService } from './BaseService';
import { RiderSchema } from '../models/schemas/RiderSchema';
import type { RiderEntity } from '../forms/rider';

export class RiderService extends BaseService<RiderEntity> {
  constructor() {
    super(RiderSchema);
  }
}