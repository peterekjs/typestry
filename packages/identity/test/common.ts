import { describe, expect, test } from 'vitest'
import { TypeIdentifier } from '../src/definitions'

const TEST_VALUES = {
  'empty string': '',
  'non-empty string': 'foo',
  'zero': 0,
  'negative zero': -0,
  'integer': 1,
  'negative integer': -1,
  'float': 0.1,
  'negative float': -0.1,
  'infinity': Infinity,
  'negative infinity': -Infinity,
  'NaN': NaN,
  'bigint': 1n,
  'boolean (false)': false,
  'boolean (true)': true,
  'symbol': Symbol(),
  'null': null,
  'undefined': void 0,

  'function': function () {},
  'function (throws exception)': function () {
    throw new Error()
  },
  'function (named)': function foo() {},
  'async function': async function foo() {},
  'lambda': () => {},
  'lambda (returns value)': () => 0,
  'generator': function *foo() {},
  'async generator': async function *foo() {},
  'class': class Foo {},
  'empty object': {},
  'non-empty object': { foo: 'bar' },
  'iterable': { *[Symbol.iterator]() {} },
  'async iterable': { *[Symbol.asyncIterator]() {} },
  'disposable': { [Symbol.dispose]() {} },
  'async disposable': { [Symbol.asyncDispose]() {} },
  'empty array': [],
  'non-empty array': [0],
  'Map': new Map(),
  'Set': new Set(),
  'WeakMap': new WeakMap(),
  'WeakSet': new WeakSet(),
  'Date': new Date(),
  'Date (invalid)': new Date('-'),
  'Error': new Error(),
} as const

type TestKey = keyof typeof TEST_VALUES

const PRIMITIVE_KEYS: TestKey[] = [
  'empty string',
  'non-empty string',
  'zero',
  'negative zero',
  'integer',
  'negative integer',
  'float',
  'negative float',
  'infinity',
  'negative infinity',
  'NaN',
  'bigint',
  'boolean (false)',
  'boolean (true)',
  'symbol',
  'null',
  'undefined',
]

function *pick(keys: Iterable<TestKey>): Generator<[TestKey, unknown]> {
  for (const key of keys) {
    if (Object.hasOwn(TEST_VALUES, key)) yield [key, TEST_VALUES[key]]
  }
}
function *drop(keys: Iterable<TestKey>): Generator<[TestKey, unknown]> {
  const keysToDrop = new Set(keys)
  for (const [key, value] of Object.entries(TEST_VALUES) as Iterable<[TestKey, unknown]>) {
    if (keysToDrop.has(key)) continue
    yield [key, value]
  }
}

function testIdentity(
  identity: TypeIdentifier<any>,
  positiveResultingEntries: Iterable<[TestKey, unknown]>,
) {
  describe(identity.name, () => {
    const positive = new Map(positiveResultingEntries)

    for (const [key, value] of positive) {
      test(key, () => {
        expect(identity.is(value)).to.be.true
        expect(() => identity.assert(value)).not.to.throw()
        expect(identity.ensure(value)).to.eql(value)
      })
    }
    for (const [key, value] of drop(positive.keys())) {
      test(key, () => {
        expect(identity.is(value)).to.be.false
        expect(() => identity.assert(value)).to.throw()
        expect(() => identity.ensure(value)).to.throw()
      })
    }
  })
}

export { PRIMITIVE_KEYS, TEST_VALUES, pick, drop, testIdentity, type TestKey }
