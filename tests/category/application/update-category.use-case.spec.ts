import { UpdateCategoryUseCase } from '../../../src/category/application/update-category.use-case'
import { Category } from '../../../src/category/domain/category.entity'
import { CategoryInMemoryRepository } from '../../../src/category/infra/db/in-memory/category-in-memory.repository'
import { NotFoundError } from '../../../src/shared/domain/errors/not-found.error'
import { InvalidUuidError, Uuid } from '../../../src/shared/domain/value-objects/uuid.vo'

describe('UpdateCategoryUseCase test', () => {

  const sut: {
    repo?: CategoryInMemoryRepository,
    useCase?: UpdateCategoryUseCase
  } = {}

  beforeEach(() => {
    const repo = new CategoryInMemoryRepository()
    const useCase = new UpdateCategoryUseCase(repo)
    Object.assign(sut, {
      repo, useCase
    })
  })

  test('should throw error when invalid uuid given', async () => {
    await expect(() => 
      sut.useCase.execute({ id: 'fake id', name: 'fake' })
    ).rejects.toThrow(new InvalidUuidError())
  })

  test('should throw error when entity is not found', async () => {
    await expect(() => 
      sut.useCase.execute({ id: new Uuid().id, name: 'fake' })
    ).rejects.toThrow(NotFoundError)
  })

  const entity = Category.fake().aCategory().withName('Movie').build()

  test.each([
    { 
      input: {
        id: entity.category_id.id,
        name: 'test'
      },
      result: {
        id: entity.category_id.id,
        name: 'test',
        description: entity.description,
        is_active: entity.is_active,
        created_at: entity.created_at
      }
    },
    { 
      input: {
        id: entity.category_id.id,
        is_active: false
      },
      result: {
        id: entity.category_id.id,
        name: 'test',
        description: entity.description,
        is_active: false,
        created_at: entity.created_at
      }
    },
    { 
      input: {
        id: entity.category_id.id,
        description: 'banana'
      },
      result: {
        id: entity.category_id.id,
        name: 'test',
        description: 'banana',
        is_active: false,
        created_at: entity.created_at
      }
    },
    { 
      input: {
        id: entity.category_id.id,
        is_active: true
      },
      result: {
        id: entity.category_id.id,
        name: 'test',
        description: 'banana',
        is_active: true,
        created_at: entity.created_at
      }
    }
  ])('should update given fields of a category', async ({ input, result }) => {
    const spyUpdate = jest.spyOn(sut.repo, 'update')
    sut.repo.items = [entity]
    const output = await sut.useCase.execute({
      id: input.id,
      ...("name" in input && { name: input.name }),
      ...("description" in input && { description: input.description }),
      ...("is_active" in input && { is_active: input.is_active }),
    })
    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: result.name,
      description: result.description,
      is_active: result.is_active,
      created_at: result.created_at
    })
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: sut.repo.items.at(0).name,
      description: sut.repo.items.at(0).description,
      is_active: sut.repo.items.at(0).is_active,
      created_at: sut.repo.items.at(0).created_at
    })
  })
})