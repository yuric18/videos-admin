import isEqual from 'lodash/isEqual'

export abstract class ValueObject {
  public equals(vo: this): boolean {
    if (vo === null || vo === undefined) {
      return false
    }

    return isEqual(vo, this)
  }
}