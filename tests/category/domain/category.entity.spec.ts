import { Category } from '../../../src/category/domain/category.entity'
import { Uuid } from '../../../src/shared/domain/value-objects/uuid.vo'

describe('Category Unit Test', () => {

  const validateSpy = jest.spyOn(Category, 'validate') 

  describe('constructor', () => {
    test('should create a category with default values', () => {
      const category = new Category({
        name: 'Movie'
      })
      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBeNull()
      expect(category.is_active).toBeTruthy()
      expect(category.created_at).toBeInstanceOf(Date)
    })

    test('should create a category with all values', () => {
      const created_at = new Date()
      const category = new Category({
        name: 'Movie',
        description: 'Movie Description',
        is_active: false,
        created_at
      })
   
      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBe('Movie Description')
      expect(category.is_active).toBe(false)
      expect(category.created_at).toBeInstanceOf(Date)
    })
  })

  describe('create command', () => {
    test('should create a category with default values', () => {
      const category = Category.create({
        name: 'Movie'
      })
      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBeNull()
      expect(category.is_active).toBeTruthy()
      expect(category.created_at).toBeInstanceOf(Date)
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })

    test('should create a category with all values', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'Movie Description',
        is_active: false
      })
   
      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBe('Movie Description')
      expect(category.is_active).toBe(false)
      expect(category.created_at).toBeInstanceOf(Date)
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('category_id field', () => {
    const arrange = [
      { category_id: null },
      { category_id: undefined },
      { category_id: new Uuid() }
    ]

    test.each(arrange)('category_id = %j', ({ category_id }) => {
      const category = new Category({
        category_id: category_id as any,
        name: 'Movie'
      })
      expect(category.category_id).toBeInstanceOf(Uuid)
      if (category_id instanceof Uuid) {
        expect(category.category_id).toBe(category_id)
      }
    })
  })

  test('should change name', () => {
    const category = Category.create({
      name: 'Movie'
    })
    category.changeName('Comedy')
    expect(category.name).toBe('Comedy')
    expect(validateSpy).toHaveBeenCalledTimes(2)
  })

  test('should change description', () => {
    const category = Category.create({
      name: 'Movie'
    })
    category.changeDescription('Movies category')
    expect(category.description).toBe('Movies category')
    expect(validateSpy).toHaveBeenCalledTimes(2)
  })

  test('should activate a category', () => {
    const category = Category.create({
      name: 'Movie',
      is_active: false
    })
    category.activate()
    expect(category.is_active).toBe(true)
  })

  test('should deactivate a category', () => {
    const category = Category.create({
      name: 'Movie'
    })
    category.deactivate()
    expect(category.is_active).toBe(false)
  })

  describe('toJSON', () => {
    test('shoud export entity values as JSON object', () => {
      const category = Category.create({
        name: 'Movie'
      })
      const categoryObject = category.toJSON()
      expect(categoryObject).toHaveProperty('name', 'Movie')
    })
  })
})

describe('Category Validator', () => {
  describe('create command', () => {
    test('shoud validate according to rules', () => {
      Category.create({
        name: null
      })
    })
  })
})