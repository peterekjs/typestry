import type { TypeIdentity } from '../definitions'
import { describeInstance, describeType } from '../describe'
import { defineIdentity } from '../identity'
import { $assignable } from './basics'

const $Map: TypeIdentity<Map<any, any>> = defineIdentity(describeInstance(Map))
const $Set: TypeIdentity<Set<any>> = defineIdentity(describeInstance(Set))
const $WeakMap: TypeIdentity<WeakMap<any, any>> = defineIdentity(describeInstance(WeakMap))
const $WeakSet: TypeIdentity<WeakSet<any>> = defineIdentity(describeInstance(WeakSet))

const $Date: TypeIdentity<Date> = defineIdentity(describeInstance(Date))
const $validDate: TypeIdentity<Date> = defineIdentity(
  describeType('valid Date', (v): v is Date => $Date.is(v) && !isNaN(v.getTime()))
)

const $Error: TypeIdentity<Error> = defineIdentity(describeInstance(Error))

const $Iterable: TypeIdentity<Iterable<unknown>> = defineIdentity(
  describeType('Iterable', (v): v is Iterable<unknown> => $assignable.is(v) && Symbol.iterator in v)
)
const $AsyncIterable: TypeIdentity<AsyncIterable<unknown>> = defineIdentity(
  describeType('AsyncIterable', (v): v is AsyncIterable<unknown> => $assignable.is(v) && Symbol.asyncIterator in v)
)

const $Disposable: TypeIdentity<Disposable> = defineIdentity(
  describeType('Disposable', (v): v is Disposable => $assignable.is(v) && Symbol.dispose in v)
)
const $AsyncDisposable: TypeIdentity<AsyncDisposable> = defineIdentity(
  describeType('AsyncDisposable', (v): v is AsyncDisposable => $assignable.is(v) && Symbol.asyncDispose in v)
)

export { $Map, $Set, $WeakMap, $WeakSet, $Date, $validDate, $Error, $Iterable, $AsyncIterable, $Disposable, $AsyncDisposable }
