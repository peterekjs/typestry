import { describe, expect, test } from 'vitest'

import { maybe } from './modifiers'
import { $boolean } from './primitives'

describe('maybe', () => {
  test('basic use', () => {
    const $maybeBoolean = maybe($boolean)
    expect($maybeBoolean.is(true)).to.be.true
    expect($maybeBoolean.is(false)).to.be.true
    expect($maybeBoolean.is(null)).to.be.true
    expect($maybeBoolean.is(undefined)).to.be.true
    expect($maybeBoolean.is(1)).to.be.false
    expect($maybeBoolean.is(() => true)).to.be.false

    expect(() => $maybeBoolean.assert('')).toThrow()
  })
})
