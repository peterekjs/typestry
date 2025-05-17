import { describe, expect, test } from 'vitest'
import { describePrimitive, describeObject } from './describe'
import { intersectDescriptors, intersectIdentifiers, unionDescriptors, unionIdentifiers } from './merge'
import { createIdentifier } from './identifier'
import { $boolean, $number, $string } from './lib'

const validateBoolean = (v: unknown): v is boolean => typeof v === 'boolean'
const validateNumber = (v: unknown): v is number => typeof v === 'number'

describe('merge', () => {
  test('intersect primitive descriptors', () => {
    const booleanType = describePrimitive('boolean', validateBoolean)
    const numberType = describePrimitive('number', validateNumber)

    const primitiveIntersectionType = intersectDescriptors(booleanType, numberType)

    // intersection of multiple primitives is supposed to end in never
    expect(primitiveIntersectionType.name).to.be.eq('never')
    expect(primitiveIntersectionType.primitive).to.be.true
    expect(primitiveIntersectionType.props).to.be.eq(null)
    expect(primitiveIntersectionType.validate(true)).to.be.false
    expect(primitiveIntersectionType.validate(0)).to.be.false
    expect(primitiveIntersectionType.validate(NaN)).to.be.false
    expect(primitiveIntersectionType.validate(Infinity)).to.be.false
    expect(primitiveIntersectionType.validate('')).to.be.false
    expect(primitiveIntersectionType.validate(null)).to.be.false
    expect(() => primitiveIntersectionType.equals(1 as never, 1 as never)).to.throw('Equality check for type never failed')
    expect(() => primitiveIntersectionType.equals(1 as never, true as never)).to.throw('Equality check for type never failed')
    expect(() => primitiveIntersectionType.equals(1 as never, 'foo' as never)).to.throw('Equality check for type never failed')
  })

  test('intersect object descriptors', () => {
    const fooType = describeObject('foo', {
      foo: $boolean,
    })
    const barType = describeObject('bar', {
      bar: $number,
    })

    const mergedType = intersectDescriptors(fooType, barType)

    expect(mergedType.props).to.eql(new Set(['foo', 'bar']))
    expect(mergedType.primitive).to.be.false
    expect(mergedType.validate({ foo: true })).to.be.false
    expect(mergedType.validate({ bar: 0 })).to.be.false
    expect(mergedType.validate({ foo: true, bar: 0 })).to.be.true
    expect(() => mergedType.equals({ foo: true } as any, { bar: 0 } as any)).to.throw()
    expect(mergedType.equals({ foo: true, bar: 0 }, { foo: true, bar: 1 })).to.be.false
    expect(mergedType.equals({ foo: true, bar: 0 }, { foo: true, bar: 0 })).to.be.true
  })

  test('union primitive descriptors', () => {
    const booleanType = describePrimitive('boolean', validateBoolean)
    const numberType = describePrimitive('number', validateNumber)

    const booleanOrNumberType = unionDescriptors(booleanType, numberType)

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

  test('union object descriptors', () => {
    const fooType = describeObject('foo', {
      foo: describePrimitive('boolean', validateBoolean),
    })
    const barType = describeObject('bar', {
      bar: describePrimitive('number', validateNumber),
    })

    const mergedType = unionDescriptors(fooType, barType)

    expect(mergedType.props).to.eql(new Set(['foo', 'bar']))
    expect(mergedType.primitive).to.be.false
    expect(mergedType.validate({ foo: true })).to.be.true
    expect(mergedType.validate({ bar: 0 })).to.be.true
    expect(mergedType.equals({ foo: true }, { bar: 0 })).to.be.false
    expect(mergedType.equals({ foo: true }, { foo: true })).to.be.true
  })

  test('merge descriptors of object with primitive', () => {
    const fooType = describeObject('foo', {
      foo: describePrimitive('boolean', validateBoolean),
    })
    const barType = describePrimitive('number', validateNumber)

    const mergedType = unionDescriptors(fooType, barType)

    expect(mergedType.props).to.eql(new Set(['foo']))
    expect(mergedType.primitive).to.be.false
    expect(mergedType.validate({ foo: true })).to.be.true
    expect(mergedType.validate(0)).to.be.true
  })

  test('union primitive identifiers', () => {
    const $merged = unionIdentifiers($boolean, $number)
    expect($merged.is(0)).to.be.true
    expect($merged.is(true)).to.be.true
    expect(() => unionIdentifiers($boolean, {} as any)).to.throw()
  })

  test('union non-primitive identifiers', () => {
    const $foo = createIdentifier(describeObject('fooz', {
      foo: $number,
    }))
    const $bar = createIdentifier(describeObject('bar', {
      foo: $boolean,
    }))

    const $merged = unionIdentifiers($foo, $bar)
    expect($merged.props.foo.is(0)).to.be.true
    expect($merged.props.foo.is(true)).to.be.true
    expect($merged.is({ foo: 0 })).to.be.true
    expect($merged.is({ foo: true })).to.be.true
    expect(() => unionIdentifiers($foo, {} as any)).to.throw()
  })
})
