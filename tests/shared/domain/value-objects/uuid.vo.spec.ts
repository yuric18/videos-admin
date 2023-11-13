import { InvalidUuidError, Uuid } from '../../../../src/shared/domain/value-objects/uuid.vo'

describe('Uuid Unit tests', () => {

  const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate')

  test('should throw error when UUID is invalid', () => {
    expect(() => {
      new Uuid('invalid-uuid')
    }).toThrow(new InvalidUuidError())
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  test('should create a valid uuid', () => {
    const uuid = new Uuid()
    expect(uuid.id).toBeTruthy()
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  test('should accept a valid uuid', () => {
    const uuid = new Uuid()
    const uuid2 = new Uuid(uuid.id)
    expect(uuid2.id).toBe(uuid.id)
  })

})