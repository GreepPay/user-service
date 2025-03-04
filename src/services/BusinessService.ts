import { BaseService } from './BaseService';
import { BusinessSchema } from '../models/schemas/BusinessSchema';
import type { BusinessEntity } from '../forms/business';

export class BusinessService extends BaseService<BusinessEntity> {
  constructor() {
    super(BusinessSchema);
  }
}