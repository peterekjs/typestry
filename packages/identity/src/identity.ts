import type { TypeDescription, TypeIdentity } from './definitions'
import { TypeAssertionError } from './errors'

function defineIdentity<T>(description: TypeDescription<T>): TypeIdentity<T> {
  function is(input: unknown): input is T {
    return description.validate(input)
  }
  function assert(input: unknown): asserts input is T {
    if (!description.validate(input)) {
      throw new TypeAssertionError(description, input)
    }
  }
  function ensure(input: unknown) {
    assert(input)
    return input
  }

  return {
    is,
    assert,
    ensure,
    description,
  }
}

export { defineIdentity }
