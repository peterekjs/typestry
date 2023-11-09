import type { AnyFunction, Primitive } from 'ts-essentials'
import type { Assignable, Defined, ObjectLike, TypeIdentity } from '../definitions'
import { describeType } from '../describe'
import { defineIdentity } from '../identity'
import { mergeTypes } from '../merge'

const $bigint: TypeIdentity<bigint> = defineIdentity(describeType('bigint', (v): v is bigint => typeof v === 'bigint'))
const $boolean: TypeIdentity<boolean> = defineIdentity(describeType('boolean', (v): v is boolean => typeof v === 'boolean'))
const $function: TypeIdentity<AnyFunction> = defineIdentity(
  describeType('function', (v): v is AnyFunction => typeof v === 'function')
)
const $number: TypeIdentity<number> = defineIdentity(describeType('number', (v): v is number => typeof v === 'number'))
const $object: TypeIdentity<ObjectLike> = defineIdentity(
  describeType('object', (v): v is ObjectLike => typeof v === 'object' && !!v)
)
const $string: TypeIdentity<string> = defineIdentity(describeType('string', (v): v is string => typeof v === 'string'))
const $symbol: TypeIdentity<symbol> = defineIdentity(describeType('symbol', (v): v is symbol => typeof v === 'symbol'))
const $undefined: TypeIdentity<undefined> = defineIdentity(
  describeType('undefined', (v): v is undefined => typeof v === 'undefined')
)
const $defined: TypeIdentity<Defined<unknown>> = defineIdentity(
  describeType('defined', (v): v is Defined<unknown> => typeof v !== 'undefined')
)

// Not exactly primitives, but are widely used as these contain basic characteristics
const $any: TypeIdentity<any> = defineIdentity(describeType('any', (v): v is any => true))
const $null: TypeIdentity<null> = defineIdentity(describeType('null', (v): v is null => v === null))
const $nil: TypeIdentity<null | undefined> = defineIdentity(mergeTypes($null.description, $undefined.description))
const $array: TypeIdentity<any[]> = defineIdentity(describeType('any[]', Array.isArray))

const $assignable: TypeIdentity<Assignable> = defineIdentity(mergeTypes($object.description, $function.description))

const $primitive: TypeIdentity<Primitive> = defineIdentity(describeType('primitive', (v): v is Primitive => Object(v) !== v))

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
