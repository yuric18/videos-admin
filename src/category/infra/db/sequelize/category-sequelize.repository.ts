import { Category } from '../../../domain/category.entity';
import { CategorySearchParams, CategorySearchResult, ICategoryRepository } from '../../../domain/category.repository';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { CategoryModel } from './category.model';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Op } from 'sequelize';
import { CategoryModelMapper } from './category-model.mapper';

export class CategorySequelizeRepository implements ICategoryRepository {
  sortableFields: string[] = ['name', 'created_at']

  constructor(private categoryModel: typeof CategoryModel) {}

  async insert(entity: Category): Promise<void> {
    const model = CategoryModelMapper.toModel(entity).toJSON()
    await this.categoryModel.create(model)
  }

  async bulkInsert(entity: Category[]): Promise<void> {
    const models = entity.map(e => CategoryModelMapper.toModel(e).toJSON())
    await this.categoryModel.bulkCreate(models)
  }

  async update(entity: Category): Promise<void> {
    const id = entity.category_id.id
    const model = await this._get(id)

    if (!model) {
      throw new NotFoundError(id, this.getEntity())
    }

    await this.categoryModel.update(CategoryModelMapper.toModel(entity).toJSON(),
    { where: { category_id: id } })
  }

  async delete(entityId: Uuid): Promise<void> {
    const id = entityId.id
    const model = await this._get(id)

    if (!model) {
      throw new NotFoundError(id, this.getEntity())
    }

    await this.categoryModel.destroy({ where: { category_id: id } } )
  }

  async findById(entityId: Uuid): Promise<Category | null> {
    const model = await this._get(entityId.id)
    return model ? CategoryModelMapper.toEntity(model) : null
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll()

    return models.map(m => CategoryModelMapper.toEntity(m))
  }

  getEntity(): new (...args: any[]) => Category {
    return Category
  }

  private async _get(id: string) {
    return await this.categoryModel.findByPk(id)
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const offset = (props.page - 1) * props.per_page
    const limit = props.per_page

    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(props.filter && {
        where: {
          name: {[Op.like]: `%${props.filter}%`}
        }
      }),
      ...(props.sort && this.sortableFields.includes(props.sort) 
        ? { order: [[props.sort, props.sort_dir]] }
        : { order: [['created_at', 'desc']] }),
      offset,
      limit
    })

    return new CategorySearchResult({
      items: models.map(m => CategoryModelMapper.toEntity(m)),
      total: count,
      current_page: props.page,
      per_page: props.per_page
    })
  }

}