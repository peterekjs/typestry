import type { Primitive } from 'ts-essentials'
import { type ExtendedTypeOf } from './definitions'
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

export { assert, getType, isObject, isPrimitive }
