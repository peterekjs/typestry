import { $string } from '@typestry/identity'
import { describe, expect, test } from 'vitest'

import { Node } from '../node'
import { stateful } from './stateful'

async function *feed<T>(input: Iterable<T>) {
  for await (const value of input) {
    yield value
  }
}

describe('stateful', () => {
  test('basics', async () => {
    const values = ['a', 'b', 'c']
    const node = Node.create({ identifier: $string, updates: () => feed(values) })
    const withState = node.pipe(stateful())

    let i = 0
    for await (const value of node) {
      expect(value).toBe(values.at(i++ % values.length))
    }

    for await (const value of withState) {
      expect(value).toBe(values.at(i++ % values.length))
    }

    // Expecting that last of values is kept persistent
    expect(withState.state).to.eq('c')
  })

  test('direct state assignment', () => {
    const node = Node.create({ identifier: $string }).pipe(stateful())

    node.state = 'd'
    expect(node.state).to.eq('d')
    expect(() => {
      node.state = 1 as any
    }).to.throw()
  })
})
