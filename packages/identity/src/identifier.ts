import { SYMBOL_DESCRIPTOR, type TypeDescriptor, type TypeIdentifier } from './definitions'
import { TypeAssertionError } from './errors'

function createIdentifier<T>(descriptor: TypeDescriptor<T>): TypeIdentifier<T> {
  function is(input: unknown): input is T {
    return descriptor.validate(input)
  }
  function assert(input: unknown): asserts input is T {
    if (!descriptor.validate(input)) {
      throw new TypeAssertionError(descriptor, input)
    }
  }
  function ensure(input: unknown) {
    assert(input)
    return input
  }

  return {
    get name() {
      return descriptor.name
    },
    is,
    assert,
    ensure,
    equals: descriptor.equals,
    [SYMBOL_DESCRIPTOR]: descriptor,
  }
}

export { createIdentifier }
