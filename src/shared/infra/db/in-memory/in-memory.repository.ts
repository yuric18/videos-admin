import { Entity } from '../../../domain/entity';
import { NotFoundError } from '../../../domain/errors/not-found.error';
import { IRepository, ISearcheableRepository } from '../../../domain/repository/repository-interface';
import { SearchParams, SortDirection } from '../../../domain/repository/search-params';
import { SearchResult } from '../../../domain/repository/search-result';
import { ValueObject } from '../../../domain/value-object';

export abstract class InMemoryRepository<
  E extends Entity,
  EntityId extends ValueObject
> implements IRepository<E, EntityId> {

  items: E[] = []

  async insert(entity: E): Promise<void> {
    this.items.push(entity)
  }

  async bulkInsert(entity: E[]): Promise<void> {
    this.items.push(...entity)
  }

  async update(entity: E): Promise<void> {
    const indexFound = this.items.findIndex(item => item.entityId.equals(entity.entityId))
    if (indexFound === -1) {
      throw new NotFoundError(entity.entityId, this.getEntity())
    }
    this.items[indexFound] = entity
  }

  async delete(entityId: EntityId): Promise<void> {
    const indexFound = this.items.findIndex(item => item.entityId.equals(entityId))
    if (indexFound === -1) {
      throw new NotFoundError(entityId, this.getEntity())
    }
    this.items.splice(indexFound, 1)
  }

  async findById(entityId: EntityId): Promise<E | null> {
    const item = this.items.find(item => item.entityId.equals(entityId))
    return typeof item === 'undefined' ? null : item
  }

  async findAll(): Promise<E[]> {
    return this.items
  }

  abstract getEntity(): new (...args: E[]) => E
}

export abstract class InMemorySearcheableRepository<
  E extends Entity,
  EntityId extends ValueObject,
  Filter = string
> extends InMemoryRepository<E, EntityId> implements ISearcheableRepository<E, EntityId, Filter> {
  
  sortableFields: string[] = [];

  async search(props: SearchParams<Filter>): Promise<SearchResult<E>> {
    const filteredItems = await this.applyFilter(this.items, props.filter)
    const sortedItems = this.applySort(filteredItems, props.sort, props.sort_dir)
    const paginatedItems = this.applyPagination(sortedItems, props.page, props.per_page)

    return new SearchResult({
      items: paginatedItems,
      total: filteredItems.length,
      current_page: props.page,
      per_page: props.per_page
    })
  }
  

  protected abstract applyFilter(items: E[], filter: Filter | null): Promise<E[]>

  protected applySort(
    items: E[],
    sort: SearchParams['sort'],
    sortDir: SortDirection | null,
    customGetter?: (sort: string, items: E) => any
  ): E[] {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items
    }

    return [...items].sort((a, b) => {
      // @ts-ignore
      const aValue = customGetter ? customGetter(sort, a) : a[sort]
      // @ts-ignore
      const bValue = customGetter ? customGetter(sort, b) : b[sort]
      if (aValue < bValue) {
        return sortDir === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortDir === 'asc' ? 1 : -1
      }
      return 0
    })
  }
  
  protected applyPagination(items: E[], page: SearchParams['page'], perPage: SearchParams['per_page']): E[] {
    const start = (page - 1) * perPage
    const limit = start + perPage
    return items.slice(start, limit)
  }

}