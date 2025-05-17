import { describe, expect, test } from 'vitest'
import { createIdentifier } from './identifier'
import { describeObject } from './describe'
import { $number } from './lib'

describe('TypeIdentifier<T>[extract]', () => {
  const $Foo = createIdentifier(describeObject('Foo', { foo: $number }))

  test('happy path', () => {
    const original = { foo: 2, bar: 'value' }
    const extracted = $Foo.extract(original)

    expect(Object.keys(original).length).to.equal(2)
    expect(original.foo).to.equal(2)
    expect(original.bar).to.equal('value')

    expect(Object.keys(extracted).length).to.equal(1)
    expect(extracted.foo).to.equal(2)
    expect((extracted as any).bar).to.be.undefined
  })

  test('fail when wrong type is passed', () => {
    const original = { foo: true, bar: 'value' }
    expect(() => $Foo.extract(original as any)).to.throw()
  })
})

describe('TypeIdentifier<T>[props]', () => {
  test('props on object', () => {
    const $A = createIdentifier(describeObject('A', { foo: $number }))

    expect($A.props).toMatchObject({})
    expect(Object.keys($A.props)).to.eql(['foo'])
  })

  test('props on primitive', () => {
    const $A = $number

    expect($A.props).toMatchObject({})
    expect(Object.keys($A.props).length).to.equal(0)
  })
})

describe('TypeIdentifier<T>[omit]', () => {
  test('happy path', () => {
    const $A = createIdentifier(describeObject('A', { foo: $number, bar: $number }))

    expect(Object.keys($A.omit('bar').props)).to.eql(['foo'])
    expect(() => $A.assert({ foo: 1, bar: 'a' })).to.throw()
    expect($A.omit('bar').ensure({ foo: 1, bar: 'a' })).to.eql({ foo: 1, bar: 'a' })
    expect($A.omit('bar').extract({ foo: 1, bar: 'a' })).to.eql({ foo: 1 })
  })
})
