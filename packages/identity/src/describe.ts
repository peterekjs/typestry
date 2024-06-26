import type { PropDescriptions, TypeDescription, TypeFromPropDescriptions } from './definitions'
import { assert, isObject } from './helpers'

function describeType<T>(
  name: string,
  validate: (input: unknown) => input is T,
  props: T extends NonNullable<unknown> ? Set<keyof T> : Set<never> = new Set() as T extends NonNullable<unknown>
    ? Set<keyof T>
    : Set<never>
): TypeDescription<T> {
  return {
    name,
    validate,
    equals(a, b) {
      return validate(a) && validate(b) && a === b
    },
    get isObject() {
      return !!props.size // TODO: Think of better way
    },
    get props() {
      return new Set(props) as Set<any>
    },
  }
}

function describeInstance<T>(Ctor: new () => T, instantiator: () => T = () => new Ctor()): TypeDescription<T> {
  const props = new Set(Object.keys(instantiator() ?? Object.getOwnPropertyDescriptors(Ctor).prototype.value) as (keyof T)[])

  function validate(input: unknown): input is T {
    return input instanceof Ctor
  }

  return {
    name: Ctor.name,
    validate,
    equals(a, b) {
      return validate(a) && validate(b) && [...props].every((p) => a[p] === b[p])
    },
    get isObject() {
      return true
    },
    get props() {
      return new Set<any>(props)
    },
  }
}

function describeArray<T extends TypeDescription<any>>(
  description: T
): T extends TypeDescription<infer S> ? TypeDescription<S[]> : never {
  function validate(input: unknown) {
    return Array.isArray(input) && input.every(description.validate)
  }

  return {
    name: `${description.name}[]`,
    validate,
    equals(a, b) {
      return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => description.equals(v, b[i]))
    },
    get isObject() {
      return false
    },
    get props() {
      return new Set()
    },
  } as T extends TypeDescription<infer S> ? TypeDescription<S[]> : never
}

const hasOwn = <T extends NonNullable<unknown>>(input: object, key: keyof T): input is T => Object.hasOwn(input, key)

function describeObject<P extends PropDescriptions<NonNullable<unknown>>>(
  name: string,
  propDescriptions: P
): TypeDescription<TypeFromPropDescriptions<P>> {
  assert(isObject(propDescriptions), 'prop descriptions')

  type T = TypeFromPropDescriptions<P>

  const props = new Set(Object.keys(propDescriptions) as (T extends NonNullable<unknown> ? keyof T : never)[])
  const getPropEntries = () => Object.entries(propDescriptions) as [keyof T, TypeDescription<T[keyof T]>][]

  function validate(input: unknown): input is T {
    return isObject(input) && getPropEntries().every(([k, v]) => hasOwn(input, k) && v.validate(input[k]))
  }

  function equals(a: T, b: T) {
    return isObject(a) && isObject(b) && getPropEntries().every(([k, v]) => v.equals(a[k], b[k]))
  }

  return {
    name,
    validate,
    equals,
    get isObject() {
      return true
    },
    get props() {
      return new Set<any>(props)
    },
  }
}

export { describeArray, describeInstance, describeObject, describeType }
