import { Sequelize } from 'sequelize-typescript'
import { CategoryModel } from '../../../../../src/category/infra/db/sequelize/category.model'
import { CategorySequelizeRepository } from '../../../../../src/category/infra/db/sequelize/category-sequelize.repository'
import { Category } from '../../../../../src/category/domain/category.entity'
import { Uuid } from '../../../../../src/shared/domain/value-objects/uuid.vo'
import { NotFoundError } from '../../../../../src/shared/domain/errors/not-found.error'
import { CategoryModelMapper } from '../../../../../src/category/infra/db/sequelize/category-model.mapper'
import { CategorySearchParams, CategorySearchResult } from '../../../../../src/category/domain/category.repository'

describe('CategorySequelizeRepository integration test', () => {
  let sequelize
  let repository: CategorySequelizeRepository

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      models: [CategoryModel],
      logging: false
    })
    await sequelize.sync({ force: true })
    repository = new CategorySequelizeRepository(CategoryModel)
  })

  test('should insert a new category', async () => {
    const category = Category.fake().aCategory().build()
    await repository.insert(category)

    const inserted = await CategoryModel.findByPk(category.category_id.id)
    expect(inserted.toJSON()).toStrictEqual(category.toJSON())
  })

  test('should bulk insert some new categories', async () => {
    const categories = Category.fake().someCategories(3).build()
    await repository.bulkInsert(categories)

    const inserted = await CategoryModel.findAll()
    expect(inserted.length).toBe(3)
    expect(inserted.map(c => c.toJSON())).toStrictEqual(categories.map(c => c.toJSON()))
  })

  test('should find an entity by id', async () => {
    const found = await repository.findById(new Uuid())
    expect(found).toBeNull()

    const entity = Category.fake().aCategory().build()
    await repository.insert(entity)

    const dbEntity = await repository.findById(entity.category_id)
    expect(dbEntity.toJSON()).toStrictEqual(entity.toJSON())
  })

  test('should return all categories', async () => {
    const entity = Category.fake().aCategory().build()
    await repository.insert(entity)
    const entities = await repository.findAll()
    expect(entities.length).toBe(1)
    expect(entities[0].toJSON()).toStrictEqual(entity.toJSON())
  })

  test('should throw error when updating unexistent entity', async () => {
    await expect(repository.update(Category.fake().aCategory().build()))
      .rejects
      .toThrow(NotFoundError)
  })

  test('should update an entity', async () => {
    const entity = Category.fake().aCategory().build()
    await repository.insert(entity)

    entity.changeName('Movie Updated')
    await repository.update(entity)

    const entityFound = await repository.findById(entity.category_id)
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON())
  })

  test('should throw error when deleting unexistent entity', async () => {
    await expect(repository.delete(new Uuid()))
      .rejects
      .toThrow(NotFoundError)
  })

  test('should delete an entity', async () => {
    const entity = Category.fake().aCategory().build()
    await repository.insert(entity)

    await repository.delete(entity.category_id)

    const entityFound = await repository.findById(entity.category_id)
    expect(entityFound).toBeNull()
  })

  describe('search method tests', () => {
    test('should only apply paginate when other params are null', async () => {
      const created_at = new Date()
      const categories = Category.fake()
        .someCategories(16)
        .withName('Movie')
        .withDescription(null)
        .withCreatedAt(created_at)
        .build()
      await repository.bulkInsert(categories)
      const spyToEntity = jest.spyOn(CategoryModelMapper, 'toEntity')
      
      const searchOutput = await repository.search(new CategorySearchParams())
      expect(searchOutput).toBeInstanceOf(CategorySearchResult)
      expect(spyToEntity).toHaveBeenCalledTimes(15)
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15
      })

      searchOutput.items.forEach(i => {
        expect(i).toBeInstanceOf(Category)
        expect(i.category_id).toBeDefined()
      })
      const items = searchOutput.items.map(i => i.toJSON())
      expect(items).toMatchObject(
        new Array(15).fill({
          name: 'Movie',
          description: null,
          is_active: true,
          created_at: created_at
        })
      )
    })

    test('should order by created_at DESC when search params are null', async () => {
      const created_at = new Date()
      const categories = Category.fake()
        .someCategories(16)
        .withName((index) => `Movie ${index}`)
        .withDescription(null)
        .withCreatedAt((index) => new Date(created_at.getTime() + index))
        .build()
      await repository.bulkInsert(categories)
      
      const searchResult = await repository.search(new CategorySearchParams())
      const items = searchResult.items
      
      items.reverse().forEach((item, index) => {
        expect(`Movie ${index}`).toBe(`${categories[index].name}`)
      })
    })
  
    test('should apply paginate and filter', async () => {
      const categories = [
        Category.fake().aCategory().withName("test 123").build(),
        ...Category.fake().someCategories(8).build(),
        Category.fake().aCategory().withName("teSt 1234").build() ,
      ]

      await repository.bulkInsert(categories)
      let searchOutput = await repository.search(
        new CategorySearchParams({
          page: 1,
          per_page: 2,
          filter: 'test 123',
          sort: 'name',
          sort_dir: 'desc'
        })
      )
      expect(searchOutput).toMatchObject(
        new CategorySearchResult({
          items: [categories[0], categories.at(-1)],
          current_page: 1,
          per_page: 2,
          total: 2
        })
      )
    })
  })
})