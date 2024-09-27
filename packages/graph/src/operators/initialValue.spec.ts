import { $string } from '@typestry/identity'
import { describe, expect, test } from 'vitest'

import { Node } from '../node'
import { initialValue } from './initialValue'

describe('initialValue', () => {
  test('basics', async () => {
    const node = Node.create({ identifier: $string })
    const withInitial = initialValue('foo')

    expect(withInitial(node)).toBeInstanceOf(Node)

    for await (const value of withInitial(node)) {
      expect(value).toBe('foo')
    }
  })

  test('basics using pipe', async () => {
    const node = Node.create({ identifier: $string })

    expect(node.pipe(initialValue('foo'))).toBeInstanceOf(Node)

    for await (const value of node.pipe(initialValue('foo'))) {
      expect(value).toBe('foo')
    }
  })
})
