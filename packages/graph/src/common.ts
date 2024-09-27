import { createIdentifier, describeType, type TypeIdentifier } from '@typestry/identity'
import { EMPTY_VALUE } from './symbols'

export type Empty = typeof EMPTY_VALUE

export type IterableSource<T> = Iterable<T> | AsyncIterable<T>

export const $Empty: TypeIdentifier<Empty> = createIdentifier(describeType({ name: 'Empty', validate: isEmpty }))

export function isEmpty(value: unknown): value is Empty {
  return value === EMPTY_VALUE
}

export function defaultIfEmpty<T>(value: T | Empty, defaultValue: NoInfer<T>): T {
  return isEmpty(value) ? defaultValue : value
}

export function getIterator<T>(source: IterableSource<T> | Iterator<T> | AsyncIterator<T>) {
  if (Symbol.iterator in source) return source[Symbol.iterator]()
  if (Symbol.asyncIterator in source) return source[Symbol.asyncIterator]()
  if ('next' in source) return source
}
