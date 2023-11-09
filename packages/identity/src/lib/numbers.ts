import type { TypeIdentity } from '../definitions'
import { describeType } from '../describe'
import { defineIdentity } from '../identity'

import { $number } from './basics'

const $NaN: TypeIdentity<typeof NaN> = defineIdentity(
  describeType('NaN', (v: unknown): v is typeof NaN => $number.is(v) && isNaN(v))
)

// #region Finite Number
const $finiteNumber: TypeIdentity<number> = defineIdentity(
  describeType('finite number', (v): v is number => $number.is(v) && Number.isFinite(v))
)

const $safeInteger: TypeIdentity<number> = defineIdentity(
  describeType('safe integer', (v): v is number => Number.isSafeInteger(v))
)

const $positiveNumber: TypeIdentity<number> = defineIdentity(
  describeType('positive number', (v): v is number => $number.is(v) && v > 0)
)
const $positiveNumberOrZero: TypeIdentity<number> = defineIdentity(
  describeType('positive number or zero', (v): v is number => $number.is(v) && v >= 0)
)
const $negativeNumber: TypeIdentity<number> = defineIdentity(
  describeType('negative number', (v): v is number => $number.is(v) && v < 0)
)
const $negativeNumberOrZero: TypeIdentity<number> = defineIdentity(
  describeType('negative number or zero', (v): v is number => $number.is(v) && v <= 0)
)
const $zero: TypeIdentity<number> = defineIdentity(describeType('zero', (v): v is number => v === 0))

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
