import { Repository, EntitySchema, type DeepPartial, type FindOptionsWhere } from 'typeorm';
import { AppDataSource } from '../data-source';

export class BaseService<T extends object> {
  protected repository: Repository<T>;

  constructor(schema: EntitySchema<T>) {
    this.repository = AppDataSource.getRepository<T>(schema);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const where = { id } as unknown as FindOptionsWhere<T>;
    await this.repository.update(where, data as any);
    return this.repository.findOne({ where });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete({ id } as unknown as FindOptionsWhere<T>);
    return !!result.affected;
  }
}