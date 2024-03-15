import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { BaseEntity } from '../entitites/base-entity';

export class BaseRepository<T extends BaseEntity> {
  constructor(protected repository: Repository<T>) {}

  save(entity: T) {
    return this.repository.save(entity);
  }

  findOneById(id: number) {
    return this.repository.findOne({
      where: { id },
    } as FindOneOptions);
  }

  find(filter: Partial<T>) {
    return this.repository.find({ where: filter } as FindManyOptions);
  }

  async remove(id: number) {
    const entity = await this.findOneById(id);
    if (!entity) return null;
    return this.repository.remove(entity);
  }
}
