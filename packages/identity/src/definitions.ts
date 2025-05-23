import type { AnyFunction, Primitive } from 'ts-essentials'

const SYMBOL_DESCRIPTOR = Symbol('identity.descriptor')

type Intersect<T> = (T extends any ? ((x: T) => 0) : never) extends ((x: infer R) => 0) ? R : never

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
  readonly propDescriptors: PropDescriptors<T>
}

type TypeIdentifier<T> = {
  readonly name: string
  is(input: unknown): input is T
  assert(input: unknown): asserts input is T
  ensure(input: unknown): T
  extract<S extends T>(input: S): Pick<S, keyof T>
  omit<K extends keyof T>(...keys: K[]): TypeIdentifier<Omit<T, K>>
  equals: TypeDescriptor<T>['equals']
  readonly props: PropIdentifiers<T>
  [SYMBOL_DESCRIPTOR]: TypeDescriptor<T>
}

type PropDefinitions<T> = T extends Primitive ? {} : { [K in keyof T]: TypeDescriptor<T[K]> | TypeIdentifier<T[K]> }
type PropDescriptors<T> = { [K in keyof T]: TypeDescriptor<T[K]> }
type PropIdentifiers<T> = { [K in keyof T]: TypeIdentifier<T[K]> }

type TypeFromDescriptor<T extends TypeDescriptor<unknown>> = T extends TypeDescriptor<infer S> ? S : never
type TypeFromIdentifier<T extends TypeIdentifier<unknown>> = T extends TypeIdentifier<infer S> ? S : never
type TypeFromDescriptors<T extends TypeDescriptor<any>[]> = T[number] extends TypeDescriptor<infer S> ? S : never
type TypeFromIdentifiers<T extends TypeIdentifier<any>[]> = T[number] extends TypeIdentifier<infer S> ? S : never
type TypeFromPropDescriptors<T extends PropDescriptors<unknown>> = T extends PropDescriptors<infer S> ? S : never
type TypeFromPropIdentifiers<T extends PropIdentifiers<unknown>> = T extends PropIdentifiers<infer S> ? S : never

type ExtractTypeFromDefinition<T> = T extends TypeDescriptor<infer S> ? S : T extends TypeIdentifier<infer S> ? S : never

type TypeFromPropDefinitions<T extends {}> = { [K in keyof T]: ExtractTypeFromDefinition<T[K]> }

type TypeDescriptorIntersection<T extends TypeDescriptor<any>[]> = TypeDescriptor<Intersect<TypeFromDescriptor<T[number]>>>
type TypeDescriptorUnion<T extends TypeDescriptor<any>[]> = TypeDescriptor<TypeFromDescriptor<T[number]>>
type TypeIdentifierIntersection<T extends TypeIdentifier<any>[]> = TypeIdentifier<Intersect<TypeFromIdentifier<T[number]>>>
type TypeIdentifierUnion<T extends TypeIdentifier<any>[]> = TypeIdentifier<TypeFromIdentifier<T[number]>>

export { SYMBOL_DESCRIPTOR }
export type {
  AnyRecord,
  Assignable,
  Defined,
  ExtendedTypeOf,
  Intersect,
  Primitive,
  PropDefinitions,
  PropDescriptors,
  PropIdentifiers,
  TypeDescriptor,
  TypeDescriptorIntersection,
  TypeDescriptorUnion,
  TypeFromDescriptor,
  TypeFromDescriptors,
  TypeFromIdentifier,
  TypeFromIdentifiers,
  TypeFromPropDefinitions,
  TypeFromPropDescriptors,
  TypeFromPropIdentifiers,
  TypeIdentifier,
  TypeIdentifierIntersection,
  TypeIdentifierUnion,
}
