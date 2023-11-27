import { Entity } from '../entity'
import { ValueObject } from '../value-object'

export interface IRepository<E extends Entity, EntityId extends ValueObject> {
  insert(entity: E): Promise<void>
  bulkInsert(entity: E[]): Promise<void>
  update(entity: E): Promise<void>
  delete(entityId: EntityId): Promise<void>
  findById(entityId: EntityId): Promise<E>
  findAll(): Promise<E[]>

  getEntity(): new (...args: any[]) => E
}