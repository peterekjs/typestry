import type { TypeIdentifier } from '../definitions'
import { describeInstance, describeType } from '../describe'
import { createIdentifier } from '../identifier'
import { $assignable } from './derivates'

const $Map: TypeIdentifier<Map<any, any>> = createIdentifier(describeInstance(Map))
const $Set: TypeIdentifier<Set<any>> = createIdentifier(describeInstance(Set))
const $WeakMap: TypeIdentifier<WeakMap<any, any>> = createIdentifier(describeInstance(WeakMap))
const $WeakSet: TypeIdentifier<WeakSet<any>> = createIdentifier(describeInstance(WeakSet))

const $Date: TypeIdentifier<Date> = createIdentifier(describeInstance(Date))
const $validDate: TypeIdentifier<Date> = createIdentifier(
  describeType({ name: 'valid Date', validate: (v): v is Date => $Date.is(v) && !isNaN(v.getTime()) }),
)

const $Error: TypeIdentifier<Error> = createIdentifier(describeInstance(Error))

const $Iterable: TypeIdentifier<Iterable<unknown>> = createIdentifier(
  describeType({ name: 'Iterable', validate: (v): v is Iterable<unknown> => $assignable.is(v) && Symbol.iterator in v }),
)
const $AsyncIterable: TypeIdentifier<AsyncIterable<unknown>> = createIdentifier(
  describeType({
    name: 'AsyncIterable',
    validate: (v): v is AsyncIterable<unknown> => $assignable.is(v) && Symbol.asyncIterator in v,
  }),
)

const $Disposable: TypeIdentifier<Disposable> = createIdentifier(
  describeType({ name: 'Disposable', validate: (v): v is Disposable => $assignable.is(v) && Symbol.dispose in v }),
)
const $AsyncDisposable: TypeIdentifier<AsyncDisposable> = createIdentifier(
  describeType({
    name: 'AsyncDisposable',
    validate: (v): v is AsyncDisposable => $assignable.is(v) && Symbol.asyncDispose in v,
  }),
)

export { $Map, $Set, $WeakMap, $WeakSet, $Date, $validDate, $Error, $Iterable, $AsyncIterable, $Disposable, $AsyncDisposable }
