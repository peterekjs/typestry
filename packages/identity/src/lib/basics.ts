import type { Primitive } from 'ts-essentials'
import type { AnyRecord, Assignable, TypeIdentifier } from '../definitions'
import { describeType } from '../describe'
import { createIdentifier } from '../identifier'
import { mergeIdentifiers } from '../merge'
import { isObject, isPrimitive } from '../helpers'

import { $function } from './functions'
import { $undefined } from './primitives'

const $object: TypeIdentifier<AnyRecord> = createIdentifier(describeType('object', isObject))

// Not exactly primitives, but are widely used as these contain basic characteristics
const $any: TypeIdentifier<any> = createIdentifier(describeType('any', (v): v is any => true))
const $null: TypeIdentifier<null> = createIdentifier(describeType('null', (v): v is null => v === null))
const $nil: TypeIdentifier<null | undefined> = mergeIdentifiers($null, $undefined)
const $array: TypeIdentifier<any[]> = createIdentifier(describeType('any[]', Array.isArray))

const $assignable: TypeIdentifier<Assignable> = mergeIdentifiers($object, $function)
const $primitive: TypeIdentifier<Primitive> = createIdentifier(describeType('primitive', isPrimitive))

export { $array, $nil, $null, $object, $primitive, $assignable, $any }
