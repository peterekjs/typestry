import { SYMBOL_DESCRIPTOR, TypeIdentifier, type AnyRecord, type Primitive, type PropDefinitions, type PropDescriptors, type TypeDescriptor } from './definitions'
import { isObject } from './helpers'

type DescribeTypeOptions<T> = {
  name: string
  validate: (input: unknown) => input is T
  compare?: (a: NoInfer<T>, b: NoInfer<T>) => boolean
  props?: T extends object ? Iterable<keyof T> : never
  primitive?: boolean
}

export { describeArray, describeInstance, describeObject, describePrimitive, describeType }

function comparePrimitives<T>(a: T, b: T) {
  return a === b
}
function compareProps<T extends object>(props: Iterable<keyof T> = []): (a: T, b: T) => boolean {
  return (a: T, b: T) => [...props].every(p => a[p] === b[p])
}

function createEqualityAssertion<T>(name: string, validate: (input: unknown) => input is T) {
  return function assertEqualityInputs(a: NoInfer<T>, b: NoInfer<T>) {
    if (!validate(a)) {
      throw new TypeError(`First argument is not type of ${name}`, { cause: { a, b } })
    }
    if (!validate(b)) {
      throw new TypeError(`Second argument is not type of ${name}`, { cause: { a, b } })
    }
  }
}

function describePrimitive<T extends Primitive>(name: string, validate: (input: unknown) => input is T): TypeDescriptor<T> {
  const assertEqualityInputs = createEqualityAssertion(name, validate)

  return {
    name,
    validate,
    equals(a, b) {
      assertEqualityInputs(a, b)
      return comparePrimitives(a, b)
    },
    get primitive() {
      return true
    },
    get props() {
      return null
    },
    get propDescriptors() {
      return {} as PropDescriptors<T>
    },
  }
}

function describeType<T>({ name, validate, props, ...options }: DescribeTypeOptions<T>): TypeDescriptor<T> {
  let compare = options.compare ?? comparePrimitives
  let primitive = options.primitive ?? false

  if (props) {
    compare = compareProps(props)
    primitive = false // Ensure primitive is false
  }

  const assertEqualityInputs = createEqualityAssertion(name, validate)

  return {
    name,
    validate,
    equals(a, b) {
      assertEqualityInputs(a, b)
      return compare(a, b)
    },
    get primitive() {
      return primitive
    },
    get props(): (T extends object ? Set<keyof T> : null) | null {
      return primitive || !props ? null : (new Set(props) as T extends object ? Set<keyof T> : never)
    },
    get propDescriptors() {
      return {} as PropDescriptors<T>
    },
  }
}

function describeInstance<T extends object>(
  Ctor: new () => T,
  instantiator: () => NoInfer<T> = () => new Ctor(),
): TypeDescriptor<T> {
  const props = new Set(Object.keys(instantiator() ?? Object.getOwnPropertyDescriptors(Ctor).prototype.value) as (keyof T)[])
  const validate = (input: unknown): input is T => input instanceof Ctor
  const assertEqualityInputs = createEqualityAssertion(Ctor.name, validate)
  const compare = compareProps(props)

  return {
    name: Ctor.name,
    validate,
    equals(a, b) {
      assertEqualityInputs(a, b)
      return compare(a, b)
    },
    get primitive() {
      return false
    },
    get props(): T extends object ? Set<keyof T> : never {
      return new Set(props) as T extends object ? Set<keyof T> : never
    },
    get propDescriptors() {
      return {} as PropDescriptors<T>
    },
  }
}

function describeArray<T>(input: TypeDescriptor<T> | TypeIdentifier<T>): TypeDescriptor<T[]> {
  const descriptor = SYMBOL_DESCRIPTOR in input ? input[SYMBOL_DESCRIPTOR] : input

  function validate(input: unknown): input is T[] {
    return Array.isArray(input) && input.every(descriptor.validate)
  }

  const name = `${descriptor.name}[]`
  const assertArrayInputs = createEqualityAssertion(name, Array.isArray)

  return {
    name,
    validate,
    equals(a, b) {
      assertArrayInputs(a, b)
      if (a.length !== b.length) return false

      for (let i = 0; i < a.length; i++) {
        if (!descriptor.equals(a[i], b[i])) return false
      }
      return true
    },
    get primitive() {
      return false
    },
    get props() {
      return null
    },
    get propDescriptors() {
      return {} as PropDescriptors<T[]>
    },
  }
}

function describeObject<T extends {}>(
  name: string,
  propDefinitions: PropDefinitions<T>,
): TypeDescriptor<T> {
  if (!isObject(propDefinitions)) {
    throw new TypeError('Expected propDescriptors to be an Object', { cause: { propDefinitions } })
  }

  const getPropEntries = () => [...collectPropDescriptorEntries(propDefinitions)]

  function validateEntry(input: any, [key, descriptor]: [keyof T, TypeDescriptor<T[keyof T]>]) {
    return descriptor.validate(input[key])
  }

  function validate(input: unknown): input is T {
    if (!isObject(input)) return false

    for (const entry of getPropEntries()) {
      if (!validateEntry(input, entry)) return false
    }
    return true
  }
  const assertInputsAsObjects = createEqualityAssertion<NonNullable<any>>(name, isObject) // NonNullable<any> is here only to describe the intent. Type checks are disabled

  function equals(a: T, b: T) {
    assertInputsAsObjects(a, b)

    const results = new Set(validateProps(a, b))
    return results.size === 1 && results.has(true)
  }

  function *collectPropDescriptorEntries(input: PropDefinitions<T>): Generator<[keyof T, TypeDescriptor<T[keyof T]>]> {
    for (const [prop, definition] of Object.entries(input) as [keyof T, TypeDescriptor<T[keyof T]>][]) {
      if (!definition || typeof definition !== 'object') continue
      if (SYMBOL_DESCRIPTOR in definition) {
        yield [prop, definition[SYMBOL_DESCRIPTOR] as TypeDescriptor<any>]
        continue
      }
      yield [prop, definition]
    }
  }

  function *validateProps(a: T, b: T) {
    for (const [key, descriptor] of getPropEntries()) {
      const propError = preparePropError(key, descriptor.name, { a, b })

      if (!descriptor.validate(a[key])) {
        throw propError('first')
      }
      if (!descriptor.validate(b[key])) {
        throw propError('second')
      }

      yield descriptor.equals(a[key], b[key])
    }
  }

  function preparePropError(key: keyof T, typeName: string, cause: any) {
    return (which: string) => new TypeError(
      `Property '${name}.${String(key)}' validation failed for ${which} argument. Expected type of ${typeName}.`,
      { cause },
    )
  }

  return {
    name,
    validate,
    equals,
    get primitive() {
      return false
    },
    get props(): T extends object ? Set<keyof T> : never {
      return new Set(new Map(getPropEntries()).keys()) as T extends object ? Set<keyof T> : never
    },
    get propDescriptors() {
      return Object.fromEntries(getPropEntries()) as PropDescriptors<T>
    },
  }
}
