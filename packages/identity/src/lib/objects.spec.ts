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
import { $number } from './primitives'
import { maybe } from './modifiers'

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
})
