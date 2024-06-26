import type { Primitive } from 'ts-essentials'
import type { AnyRecord, Assignable, Defined, TypeIdentifier } from '../definitions'
import { describeType } from '../describe'
import { createIdentifier } from '../identifier'
import { mergeIdentifiers } from '../merge'
import { isObject, isPrimitive } from '../helpers'

import { $function } from './functions'
import { $null, $undefined } from './primitives'

const $defined: TypeIdentifier<Defined<unknown>> = createIdentifier(
  describeType('defined', (v): v is Defined<unknown> => typeof v !== 'undefined')
)

// Not exactly primitives, but are widely used as these contain basic characteristics
const $any: TypeIdentifier<any> = createIdentifier(describeType('any', (v): v is any => true))
const $nil: TypeIdentifier<null | undefined> = mergeIdentifiers($null, $undefined)
const $array: TypeIdentifier<any[]> = createIdentifier(describeType('any[]', Array.isArray))
const $object: TypeIdentifier<AnyRecord> = createIdentifier(describeType('object', isObject))

const $assignable: TypeIdentifier<Assignable> = mergeIdentifiers($object, $function)
const $primitive: TypeIdentifier<Primitive> = createIdentifier(describeType('primitive', isPrimitive))

export { $array, $defined, $nil, $object, $primitive, $assignable, $any }
