import { CategoryModel } from '../../../../../src/category/infra/db/sequelize/category.model'
import { Category } from '../../../../../src/category/domain/category.entity'
import { CategoryModelMapper } from '../../../../../src/category/infra/db/sequelize/category-model.mapper'
import { Uuid } from '../../../../../src/shared/domain/value-objects/uuid.vo'
import { EntityValidationError } from '../../../../../src/shared/domain/validators/validation.error'
import { setupSequelize } from '../../../../helpers/db-helpers'

describe('CategoryModelMapper integration tests', () => {
  setupSequelize({ models: [CategoryModel] })

  it('should throw error when category is invalid', () => {
    const model = CategoryModel.build({
      category_id: new Uuid().toString()
    })
    expect(() => CategoryModelMapper.toEntity(model)).toThrow(EntityValidationError)
  })

  it('should return an entity when valid model given', () => {
    const entity = Category.fake().aCategory().build()
    const model = CategoryModel.build(entity.toJSON())
    const result = CategoryModelMapper.toEntity(model)
    expect(result.toJSON()).toStrictEqual(entity.toJSON())
  })

  it('should return an model when valid entity given', () => {
    const entity = Category.fake().aCategory().build()
    const model = CategoryModelMapper.toModel(entity)
    expect(model.toJSON()).toStrictEqual(entity.toJSON())
  })
})