import type { TypeIdentifier } from '../definitions'
import { describeType } from '../describe'
import { createIdentifier } from '../identifier'

const $bigint: TypeIdentifier<bigint> = createIdentifier(describeType('bigint', (v): v is bigint => typeof v === 'bigint'))
const $boolean: TypeIdentifier<boolean> = createIdentifier(describeType('boolean', (v): v is boolean => typeof v === 'boolean'))
const $number: TypeIdentifier<number> = createIdentifier(describeType('number', (v): v is number => typeof v === 'number'))
const $string: TypeIdentifier<string> = createIdentifier(describeType('string', (v): v is string => typeof v === 'string'))
const $symbol: TypeIdentifier<symbol> = createIdentifier(describeType('symbol', (v): v is symbol => typeof v === 'symbol'))
const $undefined: TypeIdentifier<undefined> = createIdentifier(
  describeType('undefined', (v): v is undefined => typeof v === 'undefined')
)
const $null: TypeIdentifier<null> = createIdentifier(describeType('null', (v): v is null => v === null))

export { $bigint, $boolean, $null, $number, $string, $symbol, $undefined }
