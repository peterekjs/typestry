import { pick, testIdentity } from '../../test/common'
import {
  $class,
  $function,
  $AnyFunction,
  $Function,
  $AsyncFunction,
  $GeneratorFunction,
  $AsyncGeneratorFunction,
} from './functions'

testIdentity($class, pick(['class']))

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
  ]),
)

testIdentity(
  $AnyFunction,
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
  ]),
)

testIdentity(
  $Function,
  pick(['function', 'function (throws exception)', 'function (named)', 'lambda', 'lambda (returns value)']),
)

testIdentity($AsyncFunction, pick(['async function']))

testIdentity($GeneratorFunction, pick(['generator']))

testIdentity($AsyncGeneratorFunction, pick(['async generator']))
