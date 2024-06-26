import type { AnyFunction, Primitive } from 'ts-essentials'

type Defined<T> = T extends undefined ? never : T
type ObjectLike = NonNullable<unknown> & object
type Assignable = ObjectLike | AnyFunction

type Assert = (condition: unknown, message?: string) => asserts condition

type TypeDescription<T, P = T extends object ? keyof T : never> = {
  name: string
  validate: (input: unknown) => input is T
  equals(a: T, b: T): boolean
  readonly isObject: boolean
  readonly props: Set<P>
}

type TypeIdentity<T> = {
  is(input: unknown): input is T
  assert(input: unknown): asserts input is T
  ensure(input: unknown): T
  description: TypeDescription<T>
}

type PropDescriptions<T> = { [K in keyof T]: TypeDescription<T[K]> }

type TypeFromDescription<T extends TypeDescription<unknown>> = T extends TypeDescription<infer S> ? S : never
type TypeFromDescriptions<T extends TypeDescription<any>[]> = T[number] extends TypeDescription<infer S> ? S : never
type TypeFromIdentity<T extends TypeIdentity<unknown>> = T extends TypeIdentity<infer S> ? S : never
type TypeFromPropDescriptions<T extends PropDescriptions<unknown>> = T extends PropDescriptions<infer S> ? S : never

export type {
  Assert,
  Assignable,
  Defined,
  ObjectLike,
  Primitive,
  PropDescriptions,
  TypeDescription,
  TypeFromDescription,
  TypeFromDescriptions,
  TypeFromIdentity,
  TypeFromPropDescriptions,
  TypeIdentity,
}
