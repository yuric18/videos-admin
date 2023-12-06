import { DeleteCategoryUseCase } from '../../../src/category/application/delete-category.use-case'
import { Category } from '../../../src/category/domain/category.entity'
import { CategoryInMemoryRepository } from '../../../src/category/infra/db/in-memory/category-in-memory.repository'
import { NotFoundError } from '../../../src/shared/domain/errors/not-found.error'
import { InvalidUuidError, Uuid } from '../../../src/shared/domain/value-objects/uuid.vo'

describe('DeleteCategoryUseCase test', () => {

  const sut: {
    repo?: CategoryInMemoryRepository,
    useCase?: DeleteCategoryUseCase
  } = {}

  beforeEach(() => {
    const repo = new CategoryInMemoryRepository()
    const useCase = new DeleteCategoryUseCase(repo)
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

  test('should delete category', async () => {
    const spyDelete = jest.spyOn(sut.repo, 'delete')
    sut.repo.items = [entity]
    expect(sut.repo.items.length).toBe(1)
    await sut.useCase.execute(entity.category_id)
    expect(spyDelete).toHaveBeenCalledTimes(1)
    expect(sut.repo.items.length).toBe(0)
  })
})