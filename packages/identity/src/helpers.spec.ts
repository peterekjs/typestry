import { describe, expect, test } from 'vitest'
import { type ExtendedTypeOf } from './definitions'
import { assert, getType, isObject, pickProps, stripObject } from './helpers'
import { TEST_VALUES, type TestKey } from '../test/common'
import { createIdentifier } from './identifier'
import { describeObject } from './describe'
import { $number } from './lib'

describe('helpers', () => {
  test('assert', () => {
    expect(assert(true, 'foo')).to.be.undefined
    expect(() => assert(false, 'foo')).to.throw('foo')
  })

  const isObjectPositiveKeys = new Set<string>([
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

  test.each(Object.entries(TEST_VALUES))('isObject@%s', (key, value) => {
    expect(isObject(value)).to.eql(isObjectPositiveKeys.has(key))
  })

  test('getType', () => {
    const testValue = (key: TestKey, expected: ExtendedTypeOf) => expect(getType(TEST_VALUES[key])).to.eq(expected)

    testValue('empty string', 'string')
    testValue('non-empty string', 'string')

    testValue('zero', 'number')
    testValue('negative zero', 'number')
    testValue('integer', 'number')
    testValue('negative integer', 'number')
    testValue('float', 'number')
    testValue('negative float', 'number')
    testValue('infinity', 'number')
    testValue('negative infinity', 'number')
    testValue('NaN', 'number')

    testValue('bigint', 'bigint')

    testValue('boolean (false)', 'boolean')
    testValue('boolean (true)', 'boolean')

    testValue('symbol', 'symbol')
    testValue('null', 'null')
    testValue('undefined', 'undefined')

    testValue('function', 'Function')
    testValue('function (throws exception)', 'Function')
    testValue('function (named)', 'Function')
    testValue('lambda', 'Function')
    testValue('lambda (returns value)', 'Function')
    testValue('async function', 'AsyncFunction')
    testValue('generator', 'GeneratorFunction')
    testValue('async generator', 'AsyncGeneratorFunction')

    testValue('class', 'class')

    testValue('empty object', 'Object')
    testValue('non-empty object', 'Object')
    testValue('iterable', 'Object')
    testValue('async iterable', 'Object')
    testValue('disposable', 'Object')
    testValue('async disposable', 'Object')

    testValue('empty array', 'Array')
    testValue('non-empty array', 'Array')

    testValue('Map', 'Map')
    testValue('Set', 'Set')
    testValue('WeakMap', 'WeakMap')
    testValue('WeakSet', 'WeakSet')
    testValue('Date', 'Date')
    testValue('Date (invalid)', 'Date')
    testValue('Error', 'Error')
  })
})

describe('stripObject', () => {
  test('basic functionality', () => {
    const $Foo = createIdentifier(describeObject('Foo', {
      foo: $number,
      bar: $number,
    }))

    expect(pickProps(['foo', 'bar'], { foo: 1, bar: 0, baz: true })).to.eql({ foo: 1, bar: 0 })
    expect(stripObject($Foo, { foo: 1, bar: 0, baz: true })).to.eql({ foo: 1, bar: 0 })
  })
})
