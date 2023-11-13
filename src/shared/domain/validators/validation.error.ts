import { FieldErrors } from './validator-fields-interface';

export class EntityValidationError extends Error {
  constructor(public errors: FieldErrors, message = 'ValidationError') {
    super(message)
    this.name = 'EntityValidationError'
  }

  count() {
    return Object.keys(this.errors).length
  }
}