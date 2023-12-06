import { GetCategoryUseCase } from '../../../src/category/application/get-category.use-case'
import { Category } from '../../../src/category/domain/category.entity'
import { CategoryInMemoryRepository } from '../../../src/category/infra/db/in-memory/category-in-memory.repository'
import { NotFoundError } from '../../../src/shared/domain/errors/not-found.error'
import { InvalidUuidError, Uuid } from '../../../src/shared/domain/value-objects/uuid.vo'

describe('DeleteCategoryUseCase test', () => {

  const sut: {
    repo?: CategoryInMemoryRepository,
    useCase?: GetCategoryUseCase
  } = {}

  beforeEach(() => {
    const repo = new CategoryInMemoryRepository()
    const useCase = new GetCategoryUseCase(repo)
    Object.assign(sut, {
      repo, useCase
    })
  })

  
  test('should throw error when invalid uuid given', async () => {
    await expect(() => 
      sut.useCase.execute({ id: 'fake id' })
    ).rejects.toThrow(new InvalidUuidError())
  })

  test('should throw error when entity is not found', async () => {
    await expect(() => 
      sut.useCase.execute({ id: new Uuid().id })
    ).rejects.toThrow(NotFoundError)
  })

  const entity = Category.fake().aCategory().withName('Movie').build()

  test('should get a category', async () => {
    const spyGetById = jest.spyOn(sut.repo, 'findById')
    sut.repo.items = [entity]
    expect(sut.repo.items.length).toBe(1)
    const result = await sut.useCase.execute(entity.category_id)
    expect(spyGetById).toHaveBeenCalledTimes(1)
    expect(result).toStrictEqual({
      id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at
    })
  })
})