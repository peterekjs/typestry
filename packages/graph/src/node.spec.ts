import { $safeInteger } from '@typestry/identity'
import { describe, expect, test } from 'vitest'

import { Node } from './node'

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
    }
  })
}
