import type { AnyRecord, Primitive, PropDescriptors, TypeDescriptor, TypeFromPropDescriptors } from './definitions'
import { isObject } from './helpers'

type DescribeTypeOptions<T> = {
  name: string
  validate: (input: unknown) => input is T
  compare?: (a: NoInfer<T>, b: NoInfer<T>) => boolean
  props?: T extends object ? Iterable<keyof T> : never
  primitive?: boolean
}

function comparePrimitives<T>(a: T, b: T) {
  return a === b
}
function compareProps<T extends object>(props: Iterable<keyof T> = []): (a: T, b: T) => boolean {
  return (a: T, b: T) => [...props].every((p) => a[p] === b[p])
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
  }
}

function describeInstance<T extends object>(
  Ctor: new () => T,
  instantiator: () => NoInfer<T> = () => new Ctor()
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
  }
}

function describeArray<T extends TypeDescriptor<any>>(
  descriptor: T
): T extends TypeDescriptor<infer S> ? TypeDescriptor<S[]> : never {
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
  } as T extends TypeDescriptor<infer S> ? TypeDescriptor<S[]> : never
}

const hasOwn = <T extends AnyRecord>(input: object, key: keyof T): input is T => Object.hasOwn(input, key)

function describeRecord<P extends PropDescriptors<NonNullable<unknown>>, T = TypeFromPropDescriptors<P>>(
  name: string,
  propDescriptors: P
): TypeDescriptor<T> {
  if (!isObject(propDescriptors)) {
    throw new TypeError('Expected propDescriptors to be a Record', { cause: { propDescriptors } })
  }

  const getPropEntries = () => Object.entries(propDescriptors) as [keyof T, TypeDescriptor<T[keyof T]>][]

  function validateEntry(input: object, [key, descriptor]: [keyof T, TypeDescriptor<T[keyof T]>]) {
    return hasOwn(input, key) && descriptor.validate(input[key])
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

    const propError = (key: keyof T, typeName: string, which: string) =>
      new TypeError(
        `Property '${name}.${String(key)}' validation failed for ${which} argument. Expected type of ${typeName}.`,
        { cause: { a, b } }
      )

    for (const [key, descriptor] of getPropEntries()) {
      if (!descriptor.validate(a[key])) {
        throw propError(key, descriptor.name, 'first')
      }
      if (!descriptor.validate(a[key])) {
        throw propError(key, descriptor.name, 'second')
      }

      return descriptor.equals(a[key], b[key])
    }

    return isObject(a) && isObject(b) && getPropEntries().every(([k, v]) => v.equals(a[k], b[k]))
  }

  return {
    name,
    validate,
    equals,
    get primitive() {
      return false
    },
    get props(): T extends object ? Set<keyof T> : never {
      return new Set(Object.keys(propDescriptors)) as T extends object ? Set<keyof T> : never
    },
  }
}

export { describeArray, describeInstance, describeRecord, describePrimitive, describeType }
