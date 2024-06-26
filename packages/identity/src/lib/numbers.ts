import type { TypeIdentifier } from '../definitions'
import { describeType } from '../describe'
import { createIdentifier } from '../identifier'

import { $number } from './primitives'

const $NaN: TypeIdentifier<typeof NaN> = createIdentifier(
  describeType('NaN', (v: unknown): v is typeof NaN => $number.is(v) && isNaN(v))
)

// #region Finite Number
const $finiteNumber: TypeIdentifier<number> = createIdentifier(
  describeType('finite number', (v): v is number => $number.is(v) && Number.isFinite(v))
)

const $safeInteger: TypeIdentifier<number> = createIdentifier(
  describeType('safe integer', (v): v is number => Number.isSafeInteger(v))
)

const $positiveNumber: TypeIdentifier<number> = createIdentifier(
  describeType('positive number', (v): v is number => $number.is(v) && v > 0)
)
const $positiveNumberOrZero: TypeIdentifier<number> = createIdentifier(
  describeType('positive number or zero', (v): v is number => $number.is(v) && v >= 0)
)
const $negativeNumber: TypeIdentifier<number> = createIdentifier(
  describeType('negative number', (v): v is number => $number.is(v) && v < 0)
)
const $negativeNumberOrZero: TypeIdentifier<number> = createIdentifier(
  describeType('negative number or zero', (v): v is number => $number.is(v) && v <= 0)
)
const $zero: TypeIdentifier<number> = createIdentifier(describeType('zero', (v): v is number => v === 0))

export {
  $finiteNumber,
  $safeInteger,
  $NaN,
  $negativeNumber,
  $negativeNumberOrZero,
  $positiveNumber,
  $positiveNumberOrZero,
  $zero,
}
