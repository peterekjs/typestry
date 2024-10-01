import type { Primitive } from 'ts-essentials'
import { SYMBOL_DESCRIPTOR, TypeIdentifier, type ExtendedTypeOf } from './definitions'
import { AssertionError } from './errors'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new AssertionError(message, { cause: { condition } })
  }
}

function isObject<T extends NonNullable<unknown>>(input: unknown): input is T {
  return typeof input === 'object' && input !== null
}

function isPrimitive(value: unknown): value is Primitive {
  return Object(value) !== value
}

function getType(value: unknown): ExtendedTypeOf {
  if (value === null) {
    return 'null'
  }

  const baseType = typeof value

  // Primitive types
  if (isPrimitive(value)) {
    return baseType
  }

  // Symbol.toStringTag often specifies the "display name" of the
  // object's class. It's used in Object.prototype.toString().
  const tag = (value as Record<symbol, unknown>)[Symbol.toStringTag]
  if (typeof tag === 'string') {
    return tag
  }

  // If it's a function whose source code starts with the "class" keyword
  if (baseType === 'function' && Function.prototype.toString.call(value).startsWith('class')) {
    return 'class'
  }

  // The name of the constructor; for example `Array`, `GeneratorFunction`,
  // `Number`, `String`, `Boolean` or `MyCustomClass`
  const className = value.constructor.name
  if (typeof className === 'string' && className !== '') {
    return className
  }

  // At this point there's no robust way to get the type of value,
  // so we use the base implementation.
  return baseType
}

/**
 * Strip object to contain only properties defined by identifier
 * @template T Object type
 * @param {TypeIdentifier<T>} identifier Object type identifier
 * @param {T} input Object to be stripped
 * @returns Object stripped of all undeclared properties
 */
function stripObject<T extends object>(identifier: TypeIdentifier<T>, input: unknown) {
  const descriptor = identifier[SYMBOL_DESCRIPTOR]
  if (descriptor.primitive) {
    throw new TypeError('Expected non-primitive TypeIdentifier', { cause: { identifier }})
  }
  identifier.assert(input)

  return pickProps(Object.keys(descriptor.propDescriptors) as (keyof T)[], input)
}

function pickProps<T extends object, P extends keyof T>(allowedProps: P[] | Set<P>, input: T): Pick<T, P> {
  return Object.fromEntries(
    Object.entries(input).filter(([key]) => new Set<P>(allowedProps).has(key as P))
  ) as Pick<T, P>
}

export { assert, getType, isObject, isPrimitive, pickProps, stripObject }
