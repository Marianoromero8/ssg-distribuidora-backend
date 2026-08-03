import { PFCustomerRepository, CustomerFilters } from '../repositories/pfCustomer.repository';
import { NotFoundError } from '../shared/errors/NotFoundError';
import { PaginationOptions, buildPaginatedResponse } from '../shared/utils/pagination';

const repo = new PFCustomerRepository();

export class PFCustomerService {
  async getAll(filters: CustomerFilters, pagination: PaginationOptions) {
    const result = await repo.findAll(filters, pagination);
    return buildPaginatedResponse(result, pagination);
  }

  async getById(id: string) {
    const customer = await repo.findById(id);
    if (!customer) throw new NotFoundError('Customer');
    return customer;
  }
}
