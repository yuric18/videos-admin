import { Uuid } from '../../../src/shared/domain/value-objects/uuid.vo'
import { CategoryFakeBuilder } from './category-fake.builder'

describe('CategoryFakerBuilder Unit Tests', () => {
  describe('category_id prop', () => {
    const faker = CategoryFakeBuilder.aCategory()

    test('should throw error when any with methods is called without definition', () => {
      expect(() => faker.category_id).toThrow(
        new Error("Property category_id not have a factory, use 'with' methods")
      )
    })

    test('should be undefined', () => {
      expect(faker['_category_id']).toBeUndefined()
    })

    test('withCategoryId', () => {
      const categoryId = new Uuid()
      const category = faker.withCategoryId(categoryId)
      expect(category).toBeInstanceOf(CategoryFakeBuilder)  
      expect(faker.category_id).toBe(categoryId)

      faker.withCategoryId(() => categoryId)
      // @ts-expect-error _category_id is callable
      expect(faker['_category_id']()).toBe(categoryId)
      expect(faker.category_id).toBe(categoryId)
    })

    test('should pass factory to category_id factory', () => {
      let mockFactory = jest.fn(() => new Uuid())
      faker.withCategoryId(mockFactory)
      faker.build()
      expect(mockFactory).toHaveBeenCalledTimes(1)

      const categoryId = new Uuid()
      mockFactory = jest.fn(() => categoryId)

      const fakerMany = CategoryFakeBuilder.someCategories(2)
      fakerMany.withCategoryId(mockFactory)
      fakerMany.build()
      expect(mockFactory).toHaveBeenCalledTimes(2)
      expect(fakerMany.build()[0].category_id).toBe(categoryId)
      expect(fakerMany.build()[1].category_id).toBe(categoryId)
    })
  })
})