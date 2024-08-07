import type { AnyFunction, Primitive } from 'ts-essentials'

const SYMBOL_DESCRIPTOR = Symbol('identity.descriptor')

type Defined<T> = T extends undefined ? never : T
type AnyRecord = Record<string | number | symbol, unknown>
type Assignable = AnyRecord | AnyFunction
type ExtendedTypeOf = Primitive | 'null' | 'class' | 'function' | string

type TypeDescriptor<T> = {
  name: string
  validate: (input: unknown) => input is T
  equals(a: T, b: T): boolean
  readonly primitive: boolean
  readonly props: (T extends object ? Set<keyof T> : null) | null
}

type TypeIdentifier<T> = {
  readonly name: string
  is(input: unknown): input is T
  assert(input: unknown): asserts input is T
  ensure(input: unknown): T
  equals: TypeDescriptor<T>['equals']
  [SYMBOL_DESCRIPTOR]: TypeDescriptor<T>
}

type PropDescriptors<T> = { [K in keyof T]: TypeDescriptor<T[K]> }

type TypeFromDescriptor<T extends TypeDescriptor<unknown>> = T extends TypeDescriptor<infer S> ? S : never
type TypeFromDescriptors<T extends TypeDescriptor<any>[]> = T[number] extends TypeDescriptor<infer S> ? S : never
type TypeFromIdentity<T extends TypeIdentifier<unknown>> = T extends TypeIdentifier<infer S> ? S : never
type TypeFromPropDescriptors<T extends PropDescriptors<unknown>> = T extends PropDescriptors<infer S> ? S : never

type MergedDescriptor<T extends TypeDescriptor<any>[]> = TypeDescriptor<TypeFromDescriptor<T[number]>>
type MergedIdentifier<T extends TypeIdentifier<any>[]> = T[number] extends TypeIdentifier<infer S> ? TypeIdentifier<S> : never

export { SYMBOL_DESCRIPTOR }
export type {
  AnyRecord,
  Assignable,
  Defined,
  ExtendedTypeOf,
  MergedDescriptor,
  MergedIdentifier,
  Primitive,
  PropDescriptors,
  TypeDescriptor,
  TypeFromDescriptor,
  TypeFromDescriptors,
  TypeFromIdentity,
  TypeFromPropDescriptors,
  TypeIdentifier,
}
