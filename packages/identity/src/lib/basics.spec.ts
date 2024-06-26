import { PRIMITIVE_KEYS, drop, pick, testIdentity } from '../../test/common'
import { $any, $array, $assignable, $nil, $null, $object, $primitive } from './basics'

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

testIdentity($any, drop([]))
testIdentity($null, pick(['null']))
testIdentity($nil, pick(['undefined', 'null']))
testIdentity($array, pick(['empty array', 'non-empty array']))

testIdentity($assignable, drop(PRIMITIVE_KEYS))
testIdentity($primitive, pick(PRIMITIVE_KEYS))
