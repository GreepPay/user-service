import { BaseService } from './BaseService';
import { CustomerSchema } from '../models/schemas/CustomerSchema';
import type { CustomerEntity } from '../forms/customer';

export class CustomerService extends BaseService<CustomerEntity> {
  constructor() {
    super(CustomerSchema);
  }
}