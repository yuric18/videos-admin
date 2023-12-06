import { IUseCase } from '../../shared/application/use-case.interface'
import { NotFoundError } from '../../shared/domain/errors/not-found.error'
import { Uuid } from '../../shared/domain/value-objects/uuid.vo'
import { Category } from '../domain/category.entity'
import { ICategoryRepository } from '../domain/category.repository'

export class GetCategoryUseCase implements IUseCase<GetCategoryInput, GetCategoryOutput> {

  constructor(
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
    const id = new Uuid(input.id)
    const category = await this.categoryRepository.findById(id)
    if (!category) throw new NotFoundError(id, Category)

    return {
      id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at
    }
  }

}

export type GetCategoryInput = {
  id: string
}

export type GetCategoryOutput = {
  id: string
  name: string
  description: string
  is_active: boolean
  created_at: Date
}