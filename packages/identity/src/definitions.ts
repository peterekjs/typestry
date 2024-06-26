import type { AnyFunction, Primitive } from 'ts-essentials'

type Defined<T> = T extends undefined ? never : T
type ObjectLike = NonNullable<unknown> & object
type Assignable = ObjectLike | AnyFunction

type Assert = (condition: unknown, message?: string) => asserts condition

type TypeDescriptor<T, P = T extends object ? keyof T : never> = {
  name: string
  validate: (input: unknown) => input is T
  equals(a: T, b: T): boolean
  readonly isObject: boolean
  readonly props: Set<P>
}

type TypeIdentifier<T> = {
  is(input: unknown): input is T
  assert(input: unknown): asserts input is T
  ensure(input: unknown): T
  descriptor: TypeDescriptor<T>
}

type PropDescriptors<T> = { [K in keyof T]: TypeDescriptor<T[K]> }

type TypeFromDescriptor<T extends TypeDescriptor<unknown>> = T extends TypeDescriptor<infer S> ? S : never
type TypeFromDescriptors<T extends TypeDescriptor<any>[]> = T[number] extends TypeDescriptor<infer S> ? S : never
type TypeFromIdentity<T extends TypeIdentifier<unknown>> = T extends TypeIdentifier<infer S> ? S : never
type TypeFromPropDescriptors<T extends PropDescriptors<unknown>> = T extends PropDescriptors<infer S> ? S : never

type MergedDescriptor<T extends TypeDescriptor<any>[]> = T[number] extends TypeDescriptor<infer S> ? TypeDescriptor<S> : never
type MergedIdentifier<T extends TypeIdentifier<any>[]> = T[number] extends TypeIdentifier<infer S> ? TypeIdentifier<S> : never

export type {
  Assert,
  Assignable,
  Defined,
  MergedDescriptor,
  MergedIdentifier,
  ObjectLike,
  Primitive,
  PropDescriptors,
  TypeDescriptor,
  TypeFromDescriptor,
  TypeFromDescriptors,
  TypeFromIdentity,
  TypeFromPropDescriptors,
  TypeIdentifier,
}
