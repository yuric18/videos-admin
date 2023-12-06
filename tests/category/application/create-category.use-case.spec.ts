import { CreateCategoryUseCase } from '../../../src/category/application/create-category.use-case'
import { CategoryInMemoryRepository } from '../../../src/category/infra/db/in-memory/category-in-memory.repository'
import { Uuid } from '../../../src/shared/domain/value-objects/uuid.vo'

describe('CreateCategoryUseCase test', () => {

  const mock: {
    repo?: CategoryInMemoryRepository,
    useCase?: CreateCategoryUseCase
  } = {}

  beforeEach(() => {
    const repo = new CategoryInMemoryRepository()
    const useCase = new CreateCategoryUseCase(repo)
    Object.assign(mock, {
      repo, useCase
    })
  })

  it('should create a category', async () => {
    const spyInsert = jest.spyOn(mock.repo,  'insert')
    let output = await mock.useCase.execute({ name: 'test' })
    expect(spyInsert).toHaveBeenCalledTimes(1)
    expect(output).toStrictEqual({
      id: mock.repo.items[0].category_id.id,
      name: mock.repo.items[0].name,
      description: null,
      is_active: true,
      created_at: mock.repo.items[0].created_at
    })
  })

  it('should correctly insert on database', async () => {
    let output = await mock.useCase.execute({ name: 'test' })
    const dbReg = await mock.repo.findById(new Uuid(output.id))
    expect(output).toStrictEqual({
      id: dbReg.category_id.id,
      name: dbReg.name,
      description: dbReg.description,
      is_active: dbReg.is_active,
      created_at: dbReg.created_at
    })
  })
})