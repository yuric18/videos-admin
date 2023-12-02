import { DataType, Sequelize } from 'sequelize-typescript'
import { CategoryModel } from '../../../../../src/category/infra/db/sequelize/category.model'
import { Category } from '../../../../../src/category/domain/category.entity'
import { setupSequelize } from '../../../../helpers/db-helpers'

describe('CategoryModel Integration Test', () => {

  setupSequelize({ models: [CategoryModel] })

  test('Props mapping', () => {
    const attributesMap = CategoryModel.getAttributes()
    const attributes = Object.keys(attributesMap)

    expect(attributes).toEqual([
      'category_id',
      'name',
      'description',
      'is_active',
      'created_at'
    ])

    const categoryIdAttr = attributesMap.category_id
    expect(categoryIdAttr).toMatchObject({
      field: 'category_id',
      fieldName: 'category_id',
      primaryKey: true,
      type: DataType.UUID()
    })

    const nameAttr = attributesMap.name
    expect(nameAttr).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255)
    })
    const descriptionAttr = attributesMap.description
    expect(descriptionAttr).toMatchObject({
      field: 'description',
      fieldName: 'description',
      type: DataType.TEXT()
    })

    const isActiveAttr = attributesMap.is_active
    expect(isActiveAttr).toMatchObject({
      field: 'is_active',
      fieldName: 'is_active',
      type: DataType.BOOLEAN()
    })

    const createdAtAttr = attributesMap.created_at
    expect(createdAtAttr).toMatchObject({
      field: 'created_at',
      fieldName: 'created_at',
      type: DataType.DATE(3)
    })
  })

  test('should create a category', async () => {
    const category = Category.fake().aCategory().build()

    CategoryModel.create({
      category_id: category.category_id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at
    })
  })
})