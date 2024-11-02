import { PRIMITIVE_KEYS, drop, pick, testIdentity } from '../../test/common'
import { $any, $array, $assignable, $defined, $nil, $object, $primitive } from './derivates'

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
  ]),
)

testIdentity($any, drop([]))
testIdentity($defined, drop(['undefined']))
testIdentity($nil, pick(['undefined', 'null']))
testIdentity($array, pick(['empty array', 'non-empty array']))

testIdentity($assignable, drop(PRIMITIVE_KEYS))
testIdentity($primitive, pick(PRIMITIVE_KEYS))
