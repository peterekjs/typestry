import { describe, expect, test } from 'vitest'
import { Point2D, Rect2D, Size2D } from './2d'
import type { Point, PointRange, Rect, Size } from './definitions'
import { $Point, $PointRange, $Rect, $Size } from './identity'

describe('identity', () => {
  const point = { x: 0, y: 0 } satisfies Point
  const pointInst = Point2D.fromPoint(point)
  const size = { width: 200, height: 300 } satisfies Size
  const sizeInst = Size2D.fromSize(size)
  const rect = { ...point, ...size } satisfies Rect
  const rectInst = Rect2D.fromRect(rect)

  test('$Point', () => {
    expect($Point.is(point)).to.be.true
    expect($Point.is(size)).to.be.false
    expect($Point.is(pointInst)).to.be.true
    expect($Point.is(rect)).to.be.true
    expect($Point.is(rectInst)).to.be.true
    expect($Point.equals(point, pointInst)).to.be.true
    expect($Point.equals(point, rect)).to.be.true
    expect($Point.equals(rect, rectInst)).to.be.true
  })

  test('$PointRange', () => {
    const pointRange = {
      min: point,
      max: { x: Infinity, y: Infinity },
    } satisfies PointRange
    expect($PointRange.is(pointRange)).to.be.true
  })

  test('$Rect', () => {
    expect($Rect.is(rect)).to.be.true
    expect($Rect.is(rectInst)).to.be.true
    expect($Rect.equals(rect, rectInst)).to.be.true
  })

  test('$Size', () => {
    expect($Size.is(size)).to.be.true
    expect($Size.is(sizeInst)).to.be.true
    expect($Size.is(rect)).to.be.true
    expect($Size.is(rectInst)).to.be.true
    expect($Size.equals(size, sizeInst)).to.be.true
    expect($Size.equals(size, rect)).to.be.true
    expect($Size.equals(rect, rectInst)).to.be.true
  })
})
