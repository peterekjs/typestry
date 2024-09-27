import { $number } from '@typestry/identity'
import { describe, expect, test } from 'vitest'

import { Node } from '../node'
import { map, of } from '../generators'
import { extend } from './extend'

describe('extend', () => {
  test('basics', async () => {
    const node = Node.create({ identifier: $number, updates: () => of([1, 2, 3]) })
    const multiply = map((x: number) => x * x)
    const extended = extend((node: Node<number>) => ({
      multiplied: Node.create({ identifier: $number, updates: () => multiply(node) }),
    }))

    let i = 0
    for await (const value of extended(node)) {
      expect(value).toBe(++i)
    }

    i = 0
    for await (const value of extended(node).multiplied) {
      expect(value).toBe(++i * i)
    }
  })

  test('multiple extends', async () => {
    const node = Node.create({ identifier: $number, updates: () => of([1, 2, 3]) })
    const add = map((x: number) => x + x)
    const multiply = map((x: number) => x * x)

    const foo = extend(<T extends Node<number>>(node: T) => ({
      multiplied: Node.create({ identifier: $number, updates: () => multiply(node) }),
    }))
    const bar = extend(<T extends Node<number>>(node: T) => ({
      added: Node.create({ identifier: $number, updates: () => add(node) }),
    }))

    const extended = bar(foo(node))

    let i = 0
    for await (const value of extended) {
      expect(value).toBe(++i)
    }

    i = 0
    for await (const value of extended.added) {
      expect(value).toBe(++i + i)
    }

    i = 0
    for await (const value of extended.multiplied) {
      expect(value).toBe(++i * i)
    }
  })
})
