import { PRIMITIVE_KEYS, drop, pick, testIdentity } from '../test/common'
import {
  $any,
  $array,
  $assignable,
  $bigint,
  $boolean,
  $defined,
  $function,
  $nil,
  $null,
  $number,
  $object,
  $primitive,
  $string,
  $symbol,
  $undefined,
} from './basics'

testIdentity($bigint, pick(['bigint']))
testIdentity($boolean, pick(['boolean (false)', 'boolean (true)']))
testIdentity($function, pick(['function', 'function (throws exception)', 'lambda', 'lambda (returns value)']))
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
  ])
)
testIdentity(
  $object,
  pick([
    'empty object',
    'non-empty object',
    'iterable',
    'async iterable',
    'disposable',
    'async disposable',
    'empty array',
    'non-empty array',
    'Map',
    'Set',
    'WeakMap',
    'WeakSet',
    'Date',
    'Date (invalid)',
    'Error',
  ])
)
testIdentity($string, pick(['empty string', 'non-empty string']))
testIdentity($symbol, pick(['symbol']))
testIdentity($undefined, pick(['undefined']))
testIdentity($defined, drop(['undefined']))

testIdentity($any, drop([]))
testIdentity($null, pick(['null']))
testIdentity($nil, pick(['undefined', 'null']))
testIdentity($array, pick(['empty array', 'non-empty array']))

testIdentity($assignable, drop(PRIMITIVE_KEYS))
testIdentity($primitive, pick(PRIMITIVE_KEYS))
