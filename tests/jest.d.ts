import { FieldErrors } from '../src/shared/domain/validators/validator-fields-interface';

declare global {
  namespace jest {
    interface Matchers<R> {
      toContainErrorMessages: (expected: FieldErrors) => R
    }
  }
}