import { pick, testIdentity } from '../../test/common'
import {
  $Iterable,
  $AsyncIterable,
  $Map,
  $Set,
  $WeakMap,
  $WeakSet,
  $Date,
  $validDate,
  $Error,
  $Disposable,
  $AsyncDisposable,
} from './objects'

testIdentity($Map, pick(['Map']))
testIdentity($Set, pick(['Set']))
testIdentity($WeakMap, pick(['WeakMap']))
testIdentity($WeakSet, pick(['WeakSet']))

testIdentity($Date, pick(['Date', 'Date (invalid)']))
testIdentity($validDate, pick(['Date']))

testIdentity($Error, pick(['Error']))

testIdentity($Iterable, pick(['iterable', 'empty array', 'non-empty array', 'Map', 'Set']))
testIdentity($AsyncIterable, pick(['async iterable']))

testIdentity($Disposable, pick(['disposable']))
testIdentity($AsyncDisposable, pick(['async disposable']))
