import { InMemorySearcheableRepository } from '../../../../src/shared/infra/db/in-memory/in-memory.repository';
import { Entity } from '../../../../src/shared/domain/entity';
import { NotFoundError } from '../../../../src/shared/domain/errors/not-found.error';
import { Uuid } from '../../../../src/shared/domain/value-objects/uuid.vo';
import { SearchParams } from '../../../../src/shared/domain/repository/search-params';
import { SearchResult } from '../../../../src/shared/domain/repository/search-result';

type StubEntityConstructorProps = {
  entityId?: Uuid
  name: string
  price: number
}

class StubEntity extends Entity {
  entityId: Uuid
  name: string
  price: number

  constructor(props: StubEntityConstructorProps) {
    super()
    this.entityId = props.entityId ?? new Uuid()
    this.name = props.name
    this.price = props.price
  }

  toJSON() {
    return {
      entity_id: this.entityId,
      name: this.name,
      price: this.price
    }
  }
  
}

class StubInMemorySearcheableRepository extends InMemorySearcheableRepository<StubEntity, Uuid> {
  sortableFields: string[] = ['name']

  getEntity(): new (...args: StubEntity[]) => StubEntity {
    return StubEntity
  }

  async applyFilter(items: StubEntity[], filter: string): Promise<StubEntity[]> {
    if (!filter) {
      return items
    }

    return items.filter((i) => {
      return (i.name.toLowerCase().includes(filter.toLowerCase()) || i.price.toString() === filter)
    })
  }

}

describe('InMemoryRepository unit test', () => {
  const mocks = {} as {
    repo: StubInMemorySearcheableRepository
  }

  beforeEach(() => {
    Object.assign(mocks, {
      repo: new StubInMemorySearcheableRepository() 
    })
  })

  describe('applyFilter', () => {
    test('should filter no items when filter param is null', async () => {
      const items = [new StubEntity({ name: 'name value', price: 5 })]
      const spyFilterMethod = jest.spyOn(items, 'filter' as any)
      const itemsFiltered = await mocks.repo.applyFilter(items, null)
      expect(itemsFiltered).toStrictEqual(items)
      expect(spyFilterMethod).not.toHaveBeenCalled()
    })

    test('should filter using filter param', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 5 }),
        new StubEntity({ name: 'TEST', price: 5 }),
        new StubEntity({ name: 'fake', price: 0 }),
      ]

      const spyFilterMethod = jest.spyOn(items, 'filter' as any)
      let itemsFiltered = await mocks.repo.applyFilter(items, 'TEST')

      expect(itemsFiltered).toStrictEqual([items[0], items[1]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(1)

      itemsFiltered = await mocks.repo['applyFilter'](items, '5')
      expect(itemsFiltered).toStrictEqual([items[0], items[1]])

      itemsFiltered = await mocks.repo['applyFilter'](items, '0')
      expect(itemsFiltered).toStrictEqual([items[2]])

      itemsFiltered = await mocks.repo['applyFilter'](items, 'wrong-filter')
      expect(itemsFiltered).toStrictEqual([])
    })
  })

  describe('applySort', () => {
    test('should sort no items',() => {
      const items = [
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'b', price: 0 }),
      ]

      let sortedFiltered = mocks.repo['applySort'](items, null, null)
      expect(sortedFiltered).toStrictEqual(items)

      sortedFiltered = mocks.repo['applySort'](items, 'price', 'asc')
      expect(sortedFiltered).toStrictEqual(items)
    })

    test('should sort using sort param', () => {
      const items = [
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'c', price: 5 }),
        new StubEntity({ name: 'b', price: 0 }),
      ]

      let sortedItems = mocks.repo['applySort'](items, 'name', 'asc')
      expect(sortedItems).toStrictEqual([items[0], items[2], items[1]])

      sortedItems = mocks.repo['applySort'](items, 'name', 'desc')
      expect(sortedItems).toStrictEqual([items[1], items[2], items[0]])
    })
  })

  describe('applyPaginate', () => {
    test('should paginate items', () => {
      const items = [
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'b', price: 5 }),
        new StubEntity({ name: 'c', price: 5 }),
        new StubEntity({ name: 'd', price: 5 }),
        new StubEntity({ name: 'e', price: 5 })
      ]

      let paginatedItems = mocks.repo['applyPagination'](items, 1, 2)
      expect(paginatedItems).toStrictEqual([items[0], items[1]])

      paginatedItems = mocks.repo['applyPagination'](items, 2, 2)
      expect(paginatedItems).toStrictEqual([items[2], items[3]])

      paginatedItems = mocks.repo['applyPagination'](items, 3, 2)
      expect(paginatedItems).toStrictEqual([items[4]])

      paginatedItems = mocks.repo['applyPagination'](items, 4, 2)
      expect(paginatedItems).toStrictEqual([])
    })
  })

  describe('search', () => {
    test('should apply paginate only when other params are null', async () => {
      const entity = new StubEntity({ name: 'a', price: 5 })
      const items = Array(16).fill(entity)
      mocks.repo.items = items

      const result = await mocks.repo.search(new SearchParams())
      expect(result).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          current_page: 1,
          per_page: 15
        })
      )
    })

    test('should apply paginate and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 5 }),
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'TEST', price: 5 }),
        new StubEntity({ name: 'TeST', price: 5 }),
      ]
      mocks.repo.items = items

      let result = await mocks.repo.search(
        new SearchParams({ page: 1, per_page: 2, filter: 'TEST' })
      )
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          current_page: 1,
          per_page: 2
        })
      )

      result = await mocks.repo.search(
        new SearchParams({ page: 2, per_page: 2, filter: 'TEST' })
      )
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[3]],
          total: 3,
          current_page: 2,
          per_page: 2
        })
      )
    })

    describe('should apply paginate and sort', () => {
      const items = [
        new StubEntity({ name: 'b', price: 5 }),
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'c', price: 5 }),
        new StubEntity({ name: 'e', price: 5 }),
        new StubEntity({ name: 'd', price: 5 }),
      ]

      const arrange = [
        { 
          searchParams: new SearchParams({
            page: 1,
            per_page: 2,
            sort: 'name'
          }),
          searchResult: new SearchResult({
            items: [items[1], items[0]],
            total: 5,
            current_page: 1,
            per_page: 2
          })
        },
        { 
          searchParams: new SearchParams({
            page: 2,
            per_page: 2,
            sort: 'name'
          }),
          searchResult: new SearchResult({
            items: [items[2], items[4]],
            total: 5,
            current_page: 2,
            per_page: 2
          })
        },
        { 
          searchParams: new SearchParams({
            page: 3,
            per_page: 2,
            sort: 'name'
          }),
          searchResult: new SearchResult({
            items: [items[3]],
            total: 5,
            current_page: 3,
            per_page: 2
          })
        }
      ]

      beforeEach(() => mocks.repo.items = items)

      test.each(arrange)(
        'when value is %j',
        async ({ searchParams, searchResult }) => {
          const result = await mocks.repo.search(searchParams)
          expect(result).toStrictEqual(searchResult)
        }
      )
    })
  })
})