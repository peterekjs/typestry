import { describe, expect, test } from 'vitest'
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
import { createIdentifier } from '../identifier'
import { describeObject } from '../describe'
import { $number, $string } from './primitives'
import { maybe } from './modifiers'
import { intersectIdentifiers, unionIdentifiers } from '../merge'
import { $positiveNumber, $safeInteger } from './numbers'

testIdentity($Map, pick(['Map']))
describe('$Map', () => {
  test('props', () => {
    expect($Map.props).to.be.empty
  })
})

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

describe('edge cases', () => {
  test('object with optional properties', () => {
    const $SomeObject = createIdentifier(describeObject('SomeObject', {
      foo: $number,
      bar: maybe($number)
    }))

    expect($SomeObject.is({ foo: 0 })).to.be.true
    expect($SomeObject.is({ foo: 0, bar: 1 })).to.be.true
    expect($SomeObject.is({ foo: 0, bar: null })).to.be.true
    expect($SomeObject.is({ foo: 0, bar: undefined })).to.be.true
    expect($SomeObject.is({ foo: Infinity, bar: 0 })).to.be.true
    expect($SomeObject.is({ foo: 0, bar: true })).to.be.false
    expect($SomeObject.is({ foo: '' })).to.be.false
  })

  test('object with complex intersections', () => {
    const $Foo = createIdentifier(describeObject('Foo', {
      foo: maybe($string),
      bar: maybe(intersectIdentifiers($safeInteger, $positiveNumber)),
      baz: maybe(unionIdentifiers($safeInteger, $string)),
    }))

    expect($Foo.is({})).to.be.true
    expect($Foo.is({ foo: '' })).to.be.true
    expect($Foo.is({ foo: null })).to.be.true
    expect($Foo.is({ foo: undefined })).to.be.true

    expect($Foo.is({ bar: 1 })).to.be.true
    expect($Foo.is({ bar: null })).to.be.true
    expect($Foo.is({ bar: undefined })).to.be.true
    expect($Foo.is({ bar: 0 })).to.be.false
    expect($Foo.is({ bar: -1 })).to.be.false
    expect($Foo.is({ bar: 1.5 })).to.be.false

    expect($Foo.is({ baz: 1 })).to.be.true
    expect($Foo.is({ baz: '' })).to.be.true
    expect($Foo.is({ baz: null })).to.be.true
    expect($Foo.is({ baz: undefined })).to.be.true
    expect($Foo.is({ bar: 0 })).to.be.false
    expect($Foo.is({ bar: -1 })).to.be.false
    expect($Foo.is({ bar: 1.5 })).to.be.false

    expect($Foo.is({ foo: '', bar: 1, baz: null })).to.be.true
  })
})
