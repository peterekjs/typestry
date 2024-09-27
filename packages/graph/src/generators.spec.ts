import { describe, expect, test } from 'vitest'

import { getIterator } from './common'
import { concat, filter, map, merge, of } from './generators'

describe('generators', () => {
  test('of', async () => {
    const asyncSeq = of([0, 2, 4])
    const iterator = getIterator(asyncSeq)
    expect(iterator).toBeDefined
    if (!iterator) return // Just TypeScript thing...

    expect((await iterator.next()).value).to.eq(0)
    expect((await iterator.next()).value).to.eq(2)
    expect((await iterator.next()).value).to.eq(4)
    expect((await iterator.next()).done).to.be.true
    expect((await iterator.next()).value).to.eq(undefined)
  })

  test('map', async () => {
    const asyncSeq = createAsyncIterable(0, 5)
    const iterator = getIterator(map(x => x * 2, asyncSeq))
    expect(iterator).toBeDefined
    if (!iterator) return // Just TypeScript thing...

    expect((await iterator.next()).value).to.eq(0)
    expect((await iterator.next()).value).to.eq(2)
    expect((await iterator.next()).value).to.eq(4)
    expect((await iterator.next()).value).to.eq(6)
    expect((await iterator.next()).value).to.eq(8)
    expect((await iterator.next()).done).to.be.true
    expect((await iterator.next()).value).to.eq(undefined)
  })

  test('filter', async () => {
    const asyncSeq = createAsyncIterable(0, 5)
    const iterator = getIterator(filter(x => !!(x % 2), asyncSeq))
    expect(iterator).toBeDefined
    if (!iterator) return // Just TypeScript thing...

    expect((await iterator.next()).value).to.eq(1)
    expect((await iterator.next()).value).to.eq(3)
    expect((await iterator.next()).done).to.be.true
    expect((await iterator.next()).value).to.eq(undefined)
  })

  test('concat', async () => {
    const asyncSeq = createAsyncIterable(0, 2)
    const iterator = getIterator(concat(
      map(x => x * 2, asyncSeq),
      map(x => x * 3, asyncSeq),
    ))
    expect(iterator).toBeDefined
    if (!iterator) return // Just TypeScript thing...

    expect((await iterator.next()).value).to.eq(0)
    expect((await iterator.next()).value).to.eq(2)
    expect((await iterator.next()).value).to.eq(0)
    expect((await iterator.next()).value).to.eq(3)
  })

  test('merge', async () => {
    const asyncSeq = createAsyncIterable(20, 2)
    const iterator = getIterator(merge(
      map(x => x * 2, asyncSeq),
      map(x => x * 3, asyncSeq),
    ))
    expect(iterator).toBeDefined
    if (!iterator) return // Just TypeScript thing...

    expect((await iterator.next()).value).to.eq(0)
    expect((await iterator.next()).value).to.eq(0)
    expect((await iterator.next()).value).to.eq(2)
    expect((await iterator.next()).value).to.eq(3)
  })
})

function createAsyncIterable(interval: number, max = Infinity): AsyncIterable<number> {
  return {
    [Symbol.asyncIterator]: () => generateValues(interval, max),
  }
}

async function *generateValues(interval: number, max = Infinity) {
  let i = 0
  while (i < max) {
    await new Promise(resolve => setTimeout(resolve, interval))
    yield i++
  }
}
