import { SYMBOL_DESCRIPTOR, type PropDescriptors, type PropIdentifiers, type TypeDescriptor, type TypeIdentifier } from './definitions'
import { describeObject } from './describe'
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

  function getProps() {
    if (isNonPrimitiveDescriptor(descriptor)) {
      return Object.fromEntries(mapIdentifiers(descriptor.propDescriptors)) as PropIdentifiers<T>
    } else {
      return {} as PropIdentifiers<T>
    }
  }

  function omit<K extends keyof T>(...keys: K[]): TypeIdentifier<Omit<T, K>> {
    const uniqueKeys = new Set<keyof T>(keys)

    return createIdentifier<Omit<T, K>>(describeObject(`Omit<${descriptor.name}, ${[...uniqueKeys].join(' | ')}>`, {
      ...Object.fromEntries(omitKeys<T, keyof T>(getProps(), uniqueKeys)) as any // TODO: !!!
    }))
  }

  function extract<S extends T>(input: S): Pick<S, keyof T> {
    assert(input)

    return Object.fromEntries(extractEntries(input)) as Pick<S, keyof T>
  }

  function* extractEntries(input: T): Generator<[keyof T, T[keyof T]]> {
    for (const key of Object.keys(getProps()) as (keyof T)[]) {
      yield [key, input[key]!]
    }
  }

  return {
    get name() {
      return descriptor.name
    },
    get props() {
      return getProps()
    },
    omit,
    is,
    assert,
    ensure,
    equals: descriptor.equals,
    extract,
    [SYMBOL_DESCRIPTOR]: descriptor,
  }
}

function* omitKeys<T, K extends keyof T>(props: PropIdentifiers<T>, omit: Set<K>): Generator<[K, PropIdentifiers<T>[K]]> {
  for (const [key, value] of Object.entries(props) as [K, PropIdentifiers<T>[K]][]) {
    if (omit.has(key)) continue
    yield [key, value]
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
