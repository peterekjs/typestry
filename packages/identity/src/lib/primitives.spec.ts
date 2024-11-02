import { pick, testIdentity } from '../../test/common'
import { $bigint, $boolean, $null, $number, $string, $symbol, $undefined } from './primitives'

testIdentity($bigint, pick(['bigint']))
testIdentity($boolean, pick(['boolean (false)', 'boolean (true)']))
testIdentity(
  $number,
  pick([
    'zero',
    'negative zero',
    'integer',
    'negative integer',
    'float',
    'negative float',
    'infinity',
    'negative infinity',
    'NaN',
  ]),
)
testIdentity($string, pick(['empty string', 'non-empty string']))
testIdentity($symbol, pick(['symbol']))
testIdentity($undefined, pick(['undefined']))
testIdentity($null, pick(['null']))
