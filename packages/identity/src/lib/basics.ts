import type { AnyFunction, Primitive } from 'ts-essentials'
import type { Assignable, Defined, ObjectLike, TypeIdentifier } from '../definitions'
import { describeType } from '../describe'
import { createIdentifier } from '../identifier'
import { mergeDescriptors } from '../merge'

const $bigint: TypeIdentifier<bigint> = createIdentifier(describeType('bigint', (v): v is bigint => typeof v === 'bigint'))
const $boolean: TypeIdentifier<boolean> = createIdentifier(describeType('boolean', (v): v is boolean => typeof v === 'boolean'))
const $function: TypeIdentifier<AnyFunction> = createIdentifier(
  describeType('function', (v): v is AnyFunction => typeof v === 'function')
)
const $number: TypeIdentifier<number> = createIdentifier(describeType('number', (v): v is number => typeof v === 'number'))
const $object: TypeIdentifier<ObjectLike> = createIdentifier(
  describeType('object', (v): v is ObjectLike => typeof v === 'object' && !!v)
)
const $string: TypeIdentifier<string> = createIdentifier(describeType('string', (v): v is string => typeof v === 'string'))
const $symbol: TypeIdentifier<symbol> = createIdentifier(describeType('symbol', (v): v is symbol => typeof v === 'symbol'))
const $undefined: TypeIdentifier<undefined> = createIdentifier(
  describeType('undefined', (v): v is undefined => typeof v === 'undefined')
)
const $defined: TypeIdentifier<Defined<unknown>> = createIdentifier(
  describeType('defined', (v): v is Defined<unknown> => typeof v !== 'undefined')
)

// Not exactly primitives, but are widely used as these contain basic characteristics
const $any: TypeIdentifier<any> = createIdentifier(describeType('any', (v): v is any => true))
const $null: TypeIdentifier<null> = createIdentifier(describeType('null', (v): v is null => v === null))
const $nil: TypeIdentifier<null | undefined> = createIdentifier(mergeDescriptors($null.descriptor, $undefined.descriptor))
const $array: TypeIdentifier<any[]> = createIdentifier(describeType('any[]', Array.isArray))

const $assignable: TypeIdentifier<Assignable> = createIdentifier(mergeDescriptors($object.descriptor, $function.descriptor))

const $primitive: TypeIdentifier<Primitive> = createIdentifier(
  describeType('primitive', (v): v is Primitive => Object(v) !== v)
)

export {
  $array,
  $bigint,
  $boolean,
  $function,
  $number,
  $object,
  $string,
  $symbol,
  $undefined,
  $defined,
  $nil,
  $null,
  $primitive,
  $assignable,
  $any,
}
