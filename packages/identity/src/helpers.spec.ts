import { describe, expect, test } from 'vitest'
import { assert, isObject } from './helpers'
import { TEST_VALUES } from './test/common'

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
})
