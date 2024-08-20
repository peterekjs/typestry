import { describe, expect, test } from 'vitest'
import { Point2D, Rect2D, Size2D, TransformMatrix2D } from './2d'

describe('Point2D', () => {
  test('basic instantiation', () => {
    let point = new Point2D(0, 0)
    expect(point).toBeInstanceOf(Point2D)
    expect(point.x).to.eq(0)
    expect(point.y).to.eq(0)

    point = new Point2D(Infinity, NaN)
    expect(point.x).to.eq(Infinity)
    expect(point.y).to.eql(NaN)
    expect(() => { point.x = 'test' as any }).toThrowError()
  })

  test('Point2D.fromPoint', () => {
    let a = Point2D.fromPoint({})
    expect(a.x).to.eq(0)
    expect(a.y).to.eq(0)

    a = Point2D.fromPoint({ x: 0, y: 0 })
    const b = Point2D.fromPoint(a)
    expect(a).not.to.eq(b)
    expect(a.x).to.eq(b.x)
    expect(a.y).to.eq(b.y)
  })

  test('Point2D.toRange', () => {
    expect(Point2D.toRange({ x: 0, y: 0 }, { x: 4, y: 2 }, { x: 8, y: 8 }, { x: -6, y: 3 })).to.eql({ min: { x: -6, y: 0 }, max: { x: 8, y: 8 }})
  })

  test('round', () => {
    const a = Point2D.fromPoint({ x: 0.5, y: 1 })
    expect(a.round()).to.eql({ x: 1, y: 1 })
    expect(a.round(Math.trunc)).to.eql({ x: 0, y: 1 })
  })

  test('toString', () => {
    const a = Point2D.fromPoint({ x: 0, y: 1 })
    expect(String(a)).to.eq('Point2D [x: 0, y: 1]')
  })

  test('iterator', () => {
    const a = new Point2D(0, 0)
    const b = new Point2D(...a)
    expect(a).not.to.eq(b)
    expect(a.x).to.eq(b.x)
    expect(a.y).to.eq(b.y)
  })
})

describe('Size2D', () => {
  test('basic instantiation', () => {
    let size = new Size2D(300, 200)
    expect(size).toBeInstanceOf(Size2D)
    expect(size.width).to.eq(300)
    expect(size.height).to.eq(200)

    size = new Size2D(Infinity, NaN)
    expect(size.width).to.eq(Infinity)
    expect(size.height).to.eql(NaN)
    expect(() => { size.width = 'test' as any }).toThrowError()
  })

  test('Size2D.fromSize', () => {
    let a = Size2D.fromSize({})
    expect(a.width).to.eq(0)
    expect(a.height).to.eq(0)

    a = Size2D.fromSize({ width: 300, height: 200 })
    const b = Size2D.fromSize(a)

    expect(a).not.to.eq(b)
    expect(a.width).to.eq(b.width)
    expect(a.height).to.eq(b.height)
  })

  test('round', () => {
    const a = Size2D.fromSize({ width: 0.5, height: 1 })
    expect(a.round()).to.eql({ width: 1, height: 1 })
    expect(a.round(Math.trunc)).to.eql({ width: 0, height: 1 })
  })

  test('transform', () => {
    const a = Size2D.fromSize({ width: 0.5, height: 1 })
    const matrix = new TransformMatrix2D().scale(2)
    expect(a.transform(matrix)).to.eql({ width: 1, height: 2 })
  })

  test('toString', () => {
    const a = Size2D.fromSize({ width: 0, height: 1 })
    expect(String(a)).to.eq('Size2D [width: 0, height: 1]')
  })

  test('iterator', () => {
    const a = new Size2D(300, 200)
    const b = new Size2D(...a)

    expect(a).not.to.eq(b)
    expect(a.width).to.eq(b.width)
    expect(a.height).to.eq(b.height)
  })
})

describe('Rect2D', () => {
  test('basic instantiation', () => {
    let rect = new Rect2D(0, 0, 300, 200)
    expect(rect).toBeInstanceOf(Rect2D)
    expect(rect.x).to.eq(0)
    expect(rect.y).to.eq(0)
    expect(rect.width).to.eq(300)
    expect(rect.height).to.eq(200)
    expect(rect.left).to.eq(0)
    expect(rect.right).to.eq(300)
    expect(rect.top).to.eq(0)
    expect(rect.bottom).to.eq(200)

    rect = new Rect2D('a' as any, true as any, Infinity, NaN)
    expect(rect.x).to.eql(NaN)
    expect(rect.y).to.eql(NaN)
    expect(rect.width).to.eq(Infinity)
    expect(rect.height).to.eql(NaN)
    expect(() => { rect.width = 'test' as any }).toThrowError()
  })

  test('Rect2D.fromRect', () => {
    const a = Rect2D.fromRect({ width: 300, height: 200 })
    const b = Rect2D.fromRect(a)

    expect(a).not.to.eq(b)
    expect(a.x).to.eq(b.x)
    expect(a.y).to.eq(b.y)
    expect(a.width).to.eq(b.width)
    expect(a.height).to.eq(b.height)
  })

  test('round', () => {
    const a = Rect2D.fromRect({ width: 0.5, height: 1 })
    expect(a.round()).to.eql({ x: 0, y: 0, width: 1, height: 1 })
    expect(a.round(Math.trunc)).to.eql({ x: 0, y: 0, width: 0, height: 1 })
  })

  test('toString', () => {
    const a = Rect2D.fromRect({ width: 300, height: 200 })
    expect(String(a)).to.eq('Rect2D [x: 0, y: 0, width: 300, height: 200]')
  })

  test('iterator', () => {
    const a = new Rect2D(10, 20, 300, 200)
    let b = new Rect2D(...a)
    expect(a).not.to.eq(b)
    expect(a.x).to.eq(b.x)
    expect(a.y).to.eq(b.y)
    expect(a.width).to.eq(b.width)
    expect(a.height).to.eq(b.height)

    const point = new Point2D(10, 20)
    const size = new Size2D(300, 200)
    b = new Rect2D(...point, ...size)
    expect(b.x).to.eq(10)
    expect(b.y).to.eq(20)
    expect(b.width).to.eq(300)
    expect(b.height).to.eq(200)
  })
})

describe('TransformMatrix2D', () => {
  const precision = 10
  const round = (value: number) => Math.round(value * precision) / precision

  const point = new Point2D(5, 6) // immutable, can be global
  const matrix = new TransformMatrix2D() // immutable, can be global

  test('iterable', () => {
    expect([...matrix]).to.eql([[1, 0, 0], [0, 1, 0], [0, 0, 1]])
    expect(String(matrix)).to.eq('|1 0 0|\n|0 1 0|\n|0 0 1|')
  })

  test('stack', () => {
    const a = new TransformMatrix2D()
    const b = a.multiply(new TransformMatrix2D())

    expect(a).not.to.eq(b)
    expect(a.stack.length).to.eq(1)
    expect(b.stack.length).to.eq(2)
    expect(b.stack.at(0)).to.eq(b)
    expect(b.stack.at(1)).to.eq(a)
    expect(point.transform(a)).to.eql(point)
    expect(point.transform(b)).to.eql(point)
  })

  test('rotate', () => {
    const matrix = new TransformMatrix2D().rotate(90)

    let rotated = point.transform(matrix)
    expect(rotated).to.eql({ x: -6, y: 5 })
    rotated = rotated.transform(matrix)
    expect(rotated).to.eql({ x: -5, y: -6 })
    rotated = rotated.transform(matrix)
    expect(rotated).to.eql({ x: 6, y: -5 })
    rotated = rotated.transform(matrix)
    expect(rotated).to.eql({ x: 5, y: 6 })
  })

  test('scale', () => {
    let matrix = new TransformMatrix2D().scale(2)

    expect(matrix.a).to.eq(2)
    expect(matrix.b).to.eq(0)
    expect(matrix.c).to.eq(0)
    expect(matrix.d).to.eq(0)
    expect(matrix.e).to.eq(2)
    expect(matrix.f).to.eq(0)
    expect(point.transform(matrix)).to.eql({ x: 10, y: 12 })

    matrix = new TransformMatrix2D().scale(1, 2)
    expect(matrix.a).to.eq(1)
    expect(matrix.e).to.eq(2)
    expect(point.transform(matrix)).to.eql({ x: 5, y: 12 })

    matrix = new TransformMatrix2D().scale(1, -1) // Flip Y-axis
    expect(point.transform(matrix)).to.eql({ x: 5, y: -6 })
  })

  test('shear', () => {
    const point = new Point2D(5, 6)
    let matrix = new TransformMatrix2D().shear(1)

    expect(point.transform(matrix)).to.eql({ x: 11, y: 6 })
    matrix = new TransformMatrix2D().shear(0, 2)
    expect(point.transform(matrix)).to.eql({ x: 5, y: 16 })
    matrix = new TransformMatrix2D().shear(2, 2)
    expect(point.transform(matrix)).to.eql({ x: 17, y: 16 })
  })

  test('translate', () => {
    const matrix = new TransformMatrix2D().translate(1, 2)

    expect(matrix.c).to.eq(1)
    expect(matrix.f).to.eq(2)
    expect(point.transform(matrix)).to.eql({ x: 6, y: 8 })
  })

  test('rotate with anchor', () => {
    let matrix = new TransformMatrix2D()
      .translate(4, 5)
      .rotate(90)
      .translate(-4, -5)

    expect(matrix.stack.length).to.eq(4)
    expect(point.transform(matrix)).to.eql({ x: 3, y: 6 })

    const anchor = { x: 4, y: 5 }
    matrix = new TransformMatrix2D().rotate(90, anchor)
    expect(matrix.stack.length).to.eq(4)
    expect(point.transform(matrix)).to.eql({ x: 3, y: 6 })
  })

  test('transform Rect2D', () => {
    const rect = new Rect2D(1, 2, 6, 5)
    const rotate = new TransformMatrix2D().rotate(90, rect.center)
    const rotatedPoints = [...rotate.apply(...rect.points)]

    expect(rotatedPoints.length).to.eq(4)
    const rotatedRect = Rect2D.fromPoints(...rotatedPoints)
    expect(rotatedRect.round(round)).to.eql({ x: 1.5, y: 1.5, width: 5, height: 6 })
  })
})
