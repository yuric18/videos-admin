import { IUseCase } from '../../shared/application/use-case.interface';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { ICategoryRepository } from '../domain/category.repository';

export class DeleteCategoryUseCase implements IUseCase<DeleteCategoryInput, DeleteCategoryOutput> {

  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(input: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
    await this.categoryRepo.delete(new Uuid(input.id))
  }
}

export type DeleteCategoryInput = {
  id: string
}

export type DeleteCategoryOutput = void