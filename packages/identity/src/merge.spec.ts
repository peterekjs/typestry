import { describe, expect, test } from 'vitest'
import { describePrimitive, describeRecord } from './describe'
import { mergeDescriptors, mergeIdentifiers } from './merge'
import { createIdentifier } from './identifier'

const validateBoolean = (v: unknown): v is boolean => typeof v === 'boolean'
const validateNumber = (v: unknown): v is number => typeof v === 'number'

describe('merge', () => {
  test('mergeDescriptors', () => {
    const booleanType = describePrimitive('boolean', validateBoolean)
    const numberType = describePrimitive('number', validateNumber)

    const booleanOrNumberType = mergeDescriptors(booleanType, numberType)

    expect(booleanOrNumberType.name).to.be.eq('boolean | number')
    expect(booleanOrNumberType.validate(true)).to.be.true
    expect(booleanOrNumberType.validate(0)).to.be.true
    expect(booleanOrNumberType.validate(NaN)).to.be.true
    expect(booleanOrNumberType.validate(Infinity)).to.be.true
    expect(booleanOrNumberType.validate('')).to.be.false
    expect(booleanOrNumberType.validate(null)).to.be.false
    expect(booleanOrNumberType.equals(1, 1)).to.be.true
    expect(booleanOrNumberType.equals(1, 1)).to.be.true
    expect(booleanOrNumberType.equals(1, true)).to.be.false
    expect(() => booleanOrNumberType.equals(1, 'foo' as any)).to.throw('Equality check for type boolean | number failed')
    expect(booleanOrNumberType.primitive).to.be.true
    expect(booleanOrNumberType.props).to.be.eq(null)
  })

  test('merge object descriptors', () => {
    const fooType = describeRecord('foo', {
      foo: describePrimitive('boolean', validateBoolean)
    })
    const barType = describeRecord('bar', {
      bar: describePrimitive('number', validateNumber)
    })

    const mergedType = mergeDescriptors(fooType, barType)

    expect(mergedType.props).to.eql(new Set(['foo', 'bar']))
    expect(mergedType.primitive).to.be.false
    expect(mergedType.validate({ foo: true })).to.be.true
    expect(mergedType.validate({ bar: 0 })).to.be.true
    expect(mergedType.equals({ foo: true }, { bar: 0 })).to.be.false
    expect(mergedType.equals({ foo: true }, { foo: true })).to.be.true
  })

  test('merge descriptors of object with primitive', () => {
    const fooType = describeRecord('foo', {
      foo: describePrimitive('boolean', validateBoolean)
    })
    const barType = describePrimitive('number', validateNumber)

    const mergedType = mergeDescriptors(fooType, barType)

    expect(mergedType.props).to.eql(new Set(['foo']))
    expect(mergedType.primitive).to.be.false
    expect(mergedType.validate({ foo: true })).to.be.true
    expect(mergedType.validate(0)).to.be.true
  })

  test('mergeIdentifiers', () => {
    const $foo = createIdentifier(describePrimitive('foo', validateBoolean))
    const $bar = createIdentifier(describePrimitive('bar', validateNumber))

    const $merged = mergeIdentifiers($foo, $bar)
    expect($merged.is(0)).to.be.true
    expect($merged.is(true)).to.be.true
    expect(() => mergeIdentifiers($foo, {} as any)).to.throw()
  })
})
