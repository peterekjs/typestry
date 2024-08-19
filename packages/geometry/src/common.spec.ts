import { describe, expect, test } from 'vitest'
import { normalizeNumericValue } from './common'

describe('common', () => {
  test('normalizeNumericValue', () => {
    expect(normalizeNumericValue()).to.eq(0)
    expect(normalizeNumericValue(undefined)).to.eq(0)
    expect(normalizeNumericValue(null)).to.eq(0)
    expect(normalizeNumericValue('')).to.eql(NaN)
    expect(normalizeNumericValue(true)).to.eql(NaN)
    expect(normalizeNumericValue(() => {})).to.eql(NaN)
    expect(normalizeNumericValue(NaN)).to.eql(NaN)
    expect(normalizeNumericValue(Infinity)).to.eq(Infinity)
    expect(normalizeNumericValue(0)).to.eq(0)
    expect(normalizeNumericValue(-0)).to.eq(-0)
    expect(normalizeNumericValue(-Infinity)).to.eq(-Infinity)
    expect(normalizeNumericValue(10n)).to.eql(NaN)
  })
})
