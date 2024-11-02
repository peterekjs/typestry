import { $string } from '@typestry/identity'
import { describe, expect, test } from 'vitest'

import { Node } from './node'
import { buildNode } from './builder'
import { initialValue, extend, stateful } from './operators'
import { map } from './generators'

describe('buildNode', () => {
  const stringNode = Node.create({ identifier: $string })

  test('one extension', async () => {
    const node = buildNode(stringNode, initialValue('foo'))
    for await (const value of node) {
      expect(value).toBe('foo')
    }
  })

  test('two extensions', async () => {
    const withSigned = extend((node: Node<string>) => ({
      signed: Node.create({ identifier: $string, updates: () => map(x => '$' + x, node) }),
    }))
    const node = buildNode(stringNode, initialValue('foo'), withSigned)
    for await (const value of node) {
      expect(value).toBe('foo')
    }
    for await (const value of node.signed) {
      expect(value).toBe('$foo')
    }
  })
})
