import { describe, expect, test } from 'vitest'

import { describeArray, describeInstance, describePrimitive, describeRecord } from './describe'

const validateBoolean = (v: unknown): v is boolean => typeof v === 'boolean'

describe('describe', () => {
  test('describeType', () => {
    const booleanType = describePrimitive('boolean', validateBoolean)

    expect(booleanType.name).to.be.eq('boolean')
    expect(booleanType.validate).to.be.eq(validateBoolean)
    expect(booleanType.validate(true)).to.be.true
    expect(booleanType.validate(0)).to.be.false
    expect(booleanType.equals(true, true)).to.be.true
    expect(booleanType.equals(true, false)).to.be.false
    expect(booleanType.primitive).to.be.true
    expect(booleanType.props).to.be.eq(null)
  })

  test('describeInstance', () => {
    class Foo {
      bar = 1
    }

    const FooType = describeInstance(Foo)
    let fooInstance = new Foo()

    expect(FooType.name).to.be.eq('Foo')
    expect(FooType.validate(fooInstance)).to.be.true
    expect(FooType.validate(new Date())).to.be.false
    expect(FooType.equals(fooInstance, new Foo())).to.be.true

    fooInstance = new Foo()
    fooInstance.bar = 2
    expect(FooType.equals(fooInstance, new Foo())).to.be.false

    expect(FooType.primitive).to.be.false
    expect(FooType.props).to.be.eql(new Set(['bar']))
  })

  test('describeArray', () => {
    const booleanType = describePrimitive('boolean', validateBoolean)
    const arrayType = describeArray(booleanType)

    expect(arrayType.name).to.be.eq('boolean[]')
    expect(arrayType.validate([])).to.be.true
    expect(arrayType.validate([true, false, false, true])).to.be.true
    expect(arrayType.validate([true, false, 0, 1])).to.be.false
    expect(arrayType.equals([true, false], [true, false])).to.be.true
    expect(arrayType.primitive).to.be.false
    expect(arrayType.props).to.be.eq(null)
  })

  test('describeObject', () => {
    const objectType = describeRecord('foo', {
      bar: describePrimitive('boolean', validateBoolean),
    })

    expect(objectType.name).to.be.eq('foo')
    expect(objectType.validate({})).to.be.false
    expect(objectType.validate({ bar: true })).to.be.true
    expect(objectType.validate({ bar: true, baz: 0 })).to.be.true
    expect(objectType.validate({ bar: 0 })).to.be.false
    expect(objectType.equals({ bar: true }, { bar: true })).to.be.true
    expect(objectType.equals({ bar: true }, { bar: false })).to.be.false
    expect(objectType.primitive).to.be.false
    expect(objectType.props).to.eql(new Set(['bar']))
  })
})
