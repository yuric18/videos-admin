import { InMemoryRepository } from '../../../../src/shared/db/in-memory/in-memory.repository';
import { Entity } from '../../../../src/shared/domain/entity';
import { NotFoundError } from '../../../../src/shared/domain/errors/not-found.error';
import { Uuid } from '../../../../src/shared/domain/value-objects/uuid.vo';

type StubEntityConstructorProps = {
  entityId?: Uuid
  name: string
  price: number
}

class StubEntity extends Entity {
  entityId: Uuid
  name: string
  price: number

  constructor(props: StubEntityConstructorProps) {
    super()
    this.entityId = props.entityId ?? new Uuid()
    this.name = props.name
    this.price = props.price
  }

  toJSON() {
    return {
      entity_id: this.entityId,
      name: this.name,
      price: this.price
    }
  }
  
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: StubEntity[]) => StubEntity {
    return StubEntity
  }

}

describe('InMemoryRepository unit test', () => {
  const mocks = {} as {
    repo: StubInMemoryRepository
  }

  beforeEach(() => {
    Object.assign(mocks, {
      repo: new StubInMemoryRepository() 
    })
  })

  test('should insert a new entity', async () => {
    const entity = new StubEntity({
      entityId: new Uuid(),
      name: 'Test',
      price: 100
    })
    
    await mocks.repo.insert(entity)

    expect(mocks.repo.items.length).toBe(1)
    expect(mocks.repo.items[0]).toBe(entity)
  })

  test('should bulkInsert new entities', async () => {
    const entities = [
      new StubEntity({
        entityId: new Uuid(),
        name: 'Test',
        price: 100
      }),
      new StubEntity({
        entityId: new Uuid(),
        name: 'Test',
        price: 100
      })
    ]
    
    await mocks.repo.bulkInsert(entities)

    expect(mocks.repo.items.length).toBe(2)
    expect(mocks.repo.items[0]).toBe(entities[0])
    expect(mocks.repo.items[1]).toBe(entities[1])
  })

  test('should return all entities', async () => {
    const entities = [
      new StubEntity({
        entityId: new Uuid(),
        name: 'Test',
        price: 100
      }),
      new StubEntity({
        entityId: new Uuid(),
        name: 'Test',
        price: 100
      })
    ]

    await mocks.repo.bulkInsert(entities)
    
    const values = await mocks.repo.findAll()

    expect(values.length).toBe(2)
    expect(values[0]).toBe(entities[0])
    expect(values[1]).toBe(entities[1])
  })

  describe('update', () => {
    test('should update an entity', async () => {
      const entity = new StubEntity({
        entityId: new Uuid(),
        name: 'Test',
        price: 100
      })
  
      const entities = [
        entity,
        new StubEntity({
          entityId: new Uuid(),
          name: 'Test',
          price: 100
        })
      ]
      
      await mocks.repo.bulkInsert(entities)
      entity.price = 150
      await mocks.repo.update(entity)
      expect(mocks.repo.items[0].price).toBe(150)
      expect(mocks.repo.items[1].price).toBe(100)
    })

    test('should throw an error when entity is not found', async () => {
      const entity = new StubEntity({
        entityId: new Uuid(),
        name: 'Test',
        price: 100
      })
  
      const entities = [
        new StubEntity({
          entityId: new Uuid(),
          name: 'Test',
          price: 100
        }),
        new StubEntity({
          entityId: new Uuid(),
          name: 'Test',
          price: 100
        })
      ]
      
      await mocks.repo.bulkInsert(entities)
      entity.price = 150
      await expect(mocks.repo.update(entity)).rejects.toThrow(NotFoundError)
    })
  })

  describe('delete', () => {
    test('should delete an entity when found', async () => {
      const entityId = new Uuid()
      const entities = [
        new StubEntity({
          entityId,
          name: 'Test1',
          price: 100
        }),
        new StubEntity({
          entityId: new Uuid(),
          name: 'Test2',
          price: 100
        })
      ]
      
      await mocks.repo.bulkInsert(entities)
      expect(mocks.repo.items[0].entityId).toBe(entityId)
      await mocks.repo.delete(entityId)
      expect(mocks.repo.items[0].entityId).not.toBe(entityId)
    })

    test('should throw NotFoundError when entity not found', async () => {
      const entities = [
        new StubEntity({
          entityId: new Uuid(),
          name: 'Test1',
          price: 100
        }),
        new StubEntity({
          entityId: new Uuid(),
          name: 'Test2',
          price: 100
        })
      ]
      
      await mocks.repo.bulkInsert(entities)
      await expect(mocks.repo.delete(new Uuid())).rejects.toThrow(NotFoundError)
    })
  })

  describe('findById', () => {
    test('should return null when not found', async () => {
      const entities = [ 
        new StubEntity({
          entityId: new Uuid(),
          name: 'Test',
          price: 100
        }),
        new StubEntity({
          entityId: new Uuid(),
          name: 'Test',
          price: 100
        })
      ]

      await mocks.repo.bulkInsert(entities)
      const found = await mocks.repo.findById(new Uuid())

      expect(found).toBe(null)
    })

    test('should return the entity when found', async () => {
      const entityId = new Uuid()
      const entities = [ 
        new StubEntity({
          entityId: entityId,
          name: 'Test1',
          price: 100
        }),
        new StubEntity({
          entityId: new Uuid(),
          name: 'Test2',
          price: 100
        })
      ]

      await mocks.repo.bulkInsert(entities)
      const found = await mocks.repo.findById(entityId)

      expect(found.entityId).toBe(entityId)
      expect(found.name).toBe('Test1')
    })
  })
})