import { describe, expect, test } from 'vitest'
import { describeType } from './describe'
import { mergeDescriptors } from './merge'

const validateBoolean = (v: unknown): v is boolean => typeof v === 'boolean'
const validateNumber = (v: unknown): v is number => typeof v === 'number'

describe('merge', () => {
  test('mergeDescriptors', () => {
    const booleanType = describeType('boolean', validateBoolean)
    const numberType = describeType('number', validateNumber)

    const booleanOrNumberType = mergeDescriptors(booleanType, numberType)

    expect(booleanOrNumberType.name).to.be.eq('boolean | number')
    expect(booleanOrNumberType.validate(true)).to.be.true
    expect(booleanOrNumberType.validate(0)).to.be.true
    expect(booleanOrNumberType.validate(NaN)).to.be.true
    expect(booleanOrNumberType.validate(Infinity)).to.be.true
    expect(booleanOrNumberType.validate('')).to.be.false
    expect(booleanOrNumberType.validate(null)).to.be.false
    expect(booleanOrNumberType.equals(1, 1)).to.be.true
    expect(booleanOrNumberType.equals(1, true)).to.be.false
    expect(booleanOrNumberType.isObject).to.be.false
    expect(booleanOrNumberType.props).to.be.eql(new Set())
  })
})
