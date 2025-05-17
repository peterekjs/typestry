import type { TypeIdentifier } from '../definitions'
import { describePrimitive } from '../describe'
import { createIdentifier } from '../identifier'

const $bigint: TypeIdentifier<bigint> = createIdentifier(describePrimitive('bigint', (v): v is bigint => typeof v === 'bigint'))
const $boolean: TypeIdentifier<boolean> = createIdentifier(
  describePrimitive('boolean', (v): v is boolean => typeof v === 'boolean'),
)
const $number: TypeIdentifier<number> = createIdentifier(describePrimitive('number', (v): v is number => typeof v === 'number'))
const $string: TypeIdentifier<string> = createIdentifier(describePrimitive('string', (v): v is string => typeof v === 'string'))
const $symbol: TypeIdentifier<symbol> = createIdentifier(describePrimitive('symbol', (v): v is symbol => typeof v === 'symbol'))
const $undefined: TypeIdentifier<undefined> = createIdentifier(
  describePrimitive('undefined', (v): v is undefined => typeof v === 'undefined'),
)
const $null: TypeIdentifier<null> = createIdentifier(describePrimitive('null', (v): v is null => v === null))

export { $bigint, $boolean, $null, $number, $string, $symbol, $undefined }
