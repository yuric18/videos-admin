import { IUseCase } from '../../shared/application/use-case.interface';
import { NotFoundError } from '../../shared/domain/errors/not-found.error';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { Category } from '../domain/category.entity';
import { ICategoryRepository } from '../domain/category.repository';

export class UpdateCategoryUseCase implements IUseCase<any, any> {

  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: any): Promise<any> {
    const uuid = new Uuid(input.id)
    const category = await this.categoryRepository.findById(uuid)

    if (!category) {
      throw new NotFoundError(input.id, Category)
    }

    input.name && category.changeName(input.name)
    if ("description" in input) {
      category.changeDescription(input.description)
    }
    if ("is_active" in input) {
      if (input.is_active) category.activate()
      if (!input.is_active) category.deactivate()
    }
    
    await this.categoryRepository.update(category)

    return {
      id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at
    }
  }

}

export type UpdateCategoryInput = {
  id: string
  name?: string
  description?: string
  is_active?: boolean
}

export type UpdateCategoryOutput = {
  id: string
  name: string
  description: string
  is_active: boolean
  created_at: Date
}