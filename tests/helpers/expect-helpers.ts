import { ClassValidatorFields } from '../../src/shared/domain/validators/class-validator-fields';
import { EntityValidationError } from '../../src/shared/domain/validators/validation.error';
import { FieldErrors } from '../../src/shared/domain/validators/validator-fields-interface';

type Expected = {
  validator: ClassValidatorFields<any>
  data: any
} | (() => any)

function assertContainsErrorMessage(
  expected: FieldErrors,
  received: FieldErrors
) {
  const isMatch = expect.objectContaining(received).asymmetricMatch(expected)

  return isMatch ? isValid() : {
    pass: false,
    message: () => `
      The validation errors not contains ${JSON.stringify(received)}.
      Current: ${JSON.stringify(expected)}
    `
  }
}

expect.extend({
  toContainErrorMessages(expected: Expected, received: FieldErrors) {
    if (typeof expected === 'function') {
      try {
        expected()
        return isValid()
      } catch (e) {
        const error = e as EntityValidationError
        return assertContainsErrorMessage(error.errors, received)
      }
    } else {
      const { validator, data } = expected
      const validated = validator.validate(data)

      if (validated) {
        return isValid()
      }
      return assertContainsErrorMessage(validator.errors, received)
    }
  }
})

function isValid() {
  return { pass: true, message: () => '' }
}