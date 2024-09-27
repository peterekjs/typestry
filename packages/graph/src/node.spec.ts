import { $safeInteger, $string } from '@typestry/identity'
import { describe, expect, test } from 'vitest'

import { Node } from './node'
import { extend, initialValue } from './operators'
import { map } from './generators'

describe('Node', () => {
  test('basic node', async () => {
    const node = createNumberNode()

    let i = 0
    for await (const value of node) {
      expect(value).to.eq(++i)
      console.log(i)
    }
  })

  test('clone node', () => {
    const node = createNumberNode()
    const clone = Node.clone(node)

    expect(clone).not.to.eq(node)
    expect(clone).to.eql(node)
  })
})

function createNumberNode() {
  return Node.create({
    identifier: $safeInteger,
    async *updates() {
      yield 1
      yield 2
      yield 3
    },
  })
}

describe('Node.pipe', () => {
  const stringNode = Node.create({ identifier: $string })

  test('one extension', async () => {
    const node = Node.create({ identifier: $string }).pipe(initialValue('foo'))
    for await (const value of node) {
      expect(value).toBe('foo')
    }
  })

  test('two extensions', async () => {
    const withSigned = extend((node: Node<string>) => ({
      signed: Node.create({ identifier: $string, updates: () => map(x => '$' + x, node) }),
    }))
    const node = Node.create({ identifier: $string }).pipe(initialValue('foo'), withSigned)
    for await (const value of node) {
      expect(value).toBe('foo')
    }
    for await (const value of node.signed) {
      expect(value).toBe('$foo')
    }
  })
})
