import { pick, testIdentity } from '../test/common'
import {
  $NaN,
  $finiteNumber,
  $negativeNumber,
  $negativeNumberOrZero,
  $positiveNumber,
  $positiveNumberOrZero,
  $safeInteger,
  $zero,
} from './numbers'

testIdentity($NaN, pick(['NaN']))
testIdentity($finiteNumber, pick(['zero', 'negative zero', 'integer', 'negative integer', 'float', 'negative float']))
testIdentity($safeInteger, pick(['zero', 'negative zero', 'integer', 'negative integer']))
testIdentity($positiveNumber, pick(['integer', 'float', 'infinity']))
testIdentity($positiveNumberOrZero, pick(['integer', 'float', 'infinity', 'zero', 'negative zero']))
testIdentity($negativeNumber, pick(['negative integer', 'negative float', 'negative infinity']))
testIdentity($negativeNumberOrZero, pick(['negative integer', 'negative float', 'negative infinity', 'zero', 'negative zero']))
testIdentity($zero, pick(['zero', 'negative zero']))
