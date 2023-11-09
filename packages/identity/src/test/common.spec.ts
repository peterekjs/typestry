import { describe, expect, test } from 'vitest'
import { PRIMITIVE_KEYS, TEST_VALUES, drop, pick } from './common'

describe('test/common', () => {
  test('*pick', () => {
    const expectedLength = PRIMITIVE_KEYS.length

    expect([...pick(PRIMITIVE_KEYS)].length).to.be.eq(expectedLength)
  })

  test('*drop', () => {
    const expectedLength = Object.keys(TEST_VALUES).length - PRIMITIVE_KEYS.length

    expect([...drop(PRIMITIVE_KEYS)].length).to.be.eq(expectedLength)
  })
})
