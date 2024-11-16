import { describe, expect, test } from 'vitest'

import { describeArray, describeInstance, describePrimitive, describeObject, describeType } from './describe'
import { createIdentifier } from './identifier'
import { TypeDescriptor } from './definitions'

const validateBoolean = (v: unknown): v is boolean => typeof v === 'boolean'

describe('describe', () => {
  test('describeType', () => {
    type Foo = { foo: number }
    const someType = describeType<Foo>({
      name: 'someType',
      validate: (x: any): x is Foo => typeof x?.foo === 'number',
      props: ['foo']
    })

    expect(someType.name).to.eq('someType')
    expect(someType.validate({ foo: 1 })).to.be.true
    expect(someType.equals({ foo: 1 }, { foo: 1 })).to.be.true
    expect(someType.equals({ foo: 1 }, { foo: 2 })).to.be.false
    expect(() => someType.equals({ foo: 1 }, 2 as any)).to.throw()
    expect(someType.props).to.eql(new Set(['foo']))
    expect(someType.primitive).to.be.false
  })

  test('describePrimitive', () => {
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

    testDescriptor(describeArray(booleanType))
    testDescriptor(describeArray(createIdentifier(booleanType)))

    function testDescriptor(descriptor: TypeDescriptor<boolean[]>) {
      expect(descriptor.name).to.be.eq('boolean[]')
      expect(descriptor.validate([])).to.be.true
      expect(descriptor.validate([true, false, false, true])).to.be.true
      expect(descriptor.validate([true, false, 0, 1])).to.be.false
      expect(descriptor.equals([true, false], [true, false])).to.be.true
      expect(descriptor.primitive).to.be.false
      expect(descriptor.props).to.be.eq(null)
    }
  })

  test('describeObject', () => {
    const foo = describeObject('foo', {
      bar: describePrimitive('boolean', validateBoolean),
    })

    expect(() => describeObject('fail', true as any)).to.throw()
    expect(foo.name).to.be.eq('foo')
    expect(foo.validate({})).to.be.false
    expect(foo.validate({ bar: true })).to.be.true
    expect(foo.validate({ bar: true, baz: 0 })).to.be.true
    expect(foo.validate({ bar: 0 })).to.be.false
    expect(foo.equals({ bar: true }, { bar: true })).to.be.true
    expect(foo.equals({ bar: true }, { bar: false })).to.be.false
    expect(foo.equals({ bar: true }, { bar: true, zed: false } as any)).to.be.true // Checking only properties that matted
    expect(() => foo.equals({ bar: true }, { zed: false } as any)).to.throw()
    expect(foo.primitive).to.be.false
    expect(foo.props).to.eql(new Set(['bar']))

    const bar = describeObject('bar', {
      a: describePrimitive('boolean', validateBoolean),
      b: describePrimitive('boolean', validateBoolean)
    })

    expect(bar.validate({ a: true, b: true })).to.be.true
    expect(bar.equals({ a: true, b: true }, { a: true, b: true })).to.be.true
    expect(bar.equals({ a: false, b: true }, { a: true, b: true })).to.be.false
    expect(bar.equals({ a: true, b: true }, { a: true, b: false })).to.be.false
    expect(() => bar.equals({ a: 0, b: true } as any, { a: true, b: false })).to.throw()
    expect(() => bar.equals({ a: true, b: true }, { a: true, b: 0 } as any)).to.throw()
  })
})
