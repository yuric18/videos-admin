import { Category } from '../../../../src/category/domain/category.entity'
import { CategoryInMemoryRepository } from '../../../../src/category/infra/category-in-memory.repository'

describe('Category In-Memory Repository Tests', () => {
  let repository: CategoryInMemoryRepository

  beforeEach(() => (repository = new CategoryInMemoryRepository()))

  test('should filter no items when filter object is null', async () => {
    const items = [Category.fake().aCategory().build()]
    const filterSpy = jest.spyOn(items, 'filter' as any)

    const filteredItems = await repository['applyFilter'](items, null)
    expect(filterSpy).not.toHaveBeenCalled()
    expect(filteredItems).toStrictEqual(items)
  })

  test('should filter items using filter parameter', async () => {
    const items = [
      Category.fake().aCategory().withName('test').build(),
      Category.fake().aCategory().withName('TEST').build(),
      Category.fake().aCategory().withName('fake').build()
    ]
    const filterSpy = jest.spyOn(items, 'filter' as any)

    const filteredItems = await repository['applyFilter'](items, 'TEST')
    expect(filterSpy).toHaveBeenCalledTimes(1)
    expect(filteredItems).toStrictEqual([items[0], items[1]])
  })

  test('should sort by created_at when sort param is null', () => {
    const createdAt = new Date()

    const items = [
      Category.fake().aCategory().withCreatedAt(createdAt).build(),
      Category.fake().aCategory().withCreatedAt(new Date(createdAt.getTime() + 100 )).build(),
      Category.fake().aCategory().withCreatedAt(new Date(createdAt.getTime() + 200 )).build()
    ]

    const sortedItems = repository['applySort'](items, null, null)
    expect(sortedItems).toStrictEqual([items[2], items[1], items[0]])
  })
})