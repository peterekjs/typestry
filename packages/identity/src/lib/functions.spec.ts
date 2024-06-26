import { pick, testIdentity } from '../../test/common'
import { $function } from './functions'

testIdentity(
  $function,
  pick([
    'function',
    'function (throws exception)',
    'function (named)',
    'async function',
    'lambda',
    'lambda (returns value)',
    'generator',
    'async generator',
    'class',
  ])
)
