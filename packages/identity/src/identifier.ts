import { SYMBOL_DESCRIPTOR, type PropDescriptors, type PropIdentifiers, type TypeDescriptor, type TypeIdentifier } from './definitions'
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
    get props() {
      if (isNonPrimitiveDescriptor(descriptor)) {
        return Object.fromEntries(mapIdentifiers(descriptor.propDescriptors)) as PropIdentifiers<T>
      } else {
        return {} as PropIdentifiers<T>
      }
    },
    is,
    assert,
    ensure,
    equals: descriptor.equals,
    [SYMBOL_DESCRIPTOR]: descriptor,
  }
}

function isNonPrimitiveDescriptor<T>(descriptor: TypeDescriptor<T>): descriptor is TypeDescriptor<T & object> {
  return !descriptor.primitive
}

function* mapIdentifiers<T extends object>(descriptors: PropDescriptors<T>): Generator<[keyof T, TypeIdentifier<T[keyof T]>]> {
  for (const [prop, descriptor] of Object.entries(descriptors) as Iterable<[keyof T, TypeDescriptor<T[keyof T]>]>) {
    yield [prop, createIdentifier(descriptor)]
  }
}

export { createIdentifier }
