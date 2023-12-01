import { SortDirection } from '../../shared/domain/repository/search-params';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { InMemorySearcheableRepository } from '../../shared/infra/db/in-memory/in-memory.repository';
import { Category } from '../domain/category.entity';

export class CategoryInMemoryRepository extends InMemorySearcheableRepository<Category, Uuid> {

  sortableFields: string[] = ['name', 'created_at']

  protected async applyFilter(items: Category[], filter: string): Promise<Category[]> {
    if (!filter) {
      return items
    }

    return items.filter(i => {
      return i.name.toLowerCase().includes(filter.toLowerCase())
    })
  }
  
  protected applySort(items: Category[], sort: string, sortDir: SortDirection): Category[] {
    return sort
      ? super.applySort(items, sort, sortDir)
      : super.applySort(items, 'created_at', 'desc')
  }

  getEntity(): new (...args: Category[]) => Category {
    return Category
  }
}