import { normalizeNumericValue } from './common'
import type { Matrix, Point, PointRange, Rect, Size } from './definitions'
import { applyMatrixToPoint, multiplyMatrices } from './matrix'

const transformParents = new WeakMap<TransformMatrix2D, TransformMatrix2D>()

export class TransformMatrix2D {
  a = 1;
  b = 0;
  c = 0;
  d = 0;
  e = 1;
  f = 0;

  get stack(): TransformMatrix2D[] {
    return [...collectTransformStack(this)]
  }

  constructor(matrix?: Matrix | TransformMatrix2D) {
    if (!(Array.isArray(matrix) || matrix instanceof TransformMatrix2D)) {
      return
    }

    const [[a, b, c], [d, e, f]] = [...matrix]
    this.a = normalizeNumericValue(a)
    this.b = normalizeNumericValue(b)
    this.c = normalizeNumericValue(c)
    this.d = normalizeNumericValue(d)
    this.e = normalizeNumericValue(e)
    this.f = normalizeNumericValue(f)

    Object.freeze(this) // make instance immutable
  }

  *[Symbol.iterator]() {
    yield [this.a, this.b, this.c]
    yield [this.d, this.e, this.f]
    yield [0, 0, 1]
  }

  toString() {
    const output = []
    for (const row of this) output.push(`|${row.join(' ')}|`)
    return output.join('\n')
  }

  *apply(...points: Point[]) {
    const matrix = [...this]
    for (const point of points) {
      const transformed = applyMatrixToPoint(matrix, point)
      yield Point2D.fromMatrix(transformed)
    }
  }

  multiply(matrix: Matrix | TransformMatrix2D): TransformMatrix2D {
    return this.#createNextInstance(multiplyMatrices([...this], [...matrix]))
  }

  /**
   * Apply angle to transformation matrix
   * @param {number} [angle] Angle in degrees
   * @param {Point} [anchor] Anchor point to perform rotation around instead of [0, 0]
   */
  rotate(angle?: number, anchor?: Point): TransformMatrix2D {
    if (anchor) {
      const offsetPoint = Point2D.fromPoint(anchor)
      const revertPoint = offsetPoint.transform(new TransformMatrix2D().scale(-1, -1))

      return this.translate(...offsetPoint).rotate(angle).translate(...revertPoint)
    }

    angle = normalizeNumericValue(angle)
    const rad = normalizeNumericValue(angle) * (Math.PI / 180)
    const transform = [
      [Math.cos(rad), -Math.sin(rad), 0],
      [Math.sin(rad), Math.cos(rad), 0],
      [0, 0, 1]
    ]
    return this.#createNextInstance(multiplyMatrices([...this], transform))
  }

  /**
   *
   * @param {number} [x] Scale factor in X-axis
   * @param {number} [y] Scale factor in Y-axis
   * @returns {TransformMatrix2D} New TransformMatrix2D instance
   */
  scale(x?: number, y?: number): TransformMatrix2D {
    x = normalizeNumericValue(x)
    y = typeof y === 'undefined' ? x : normalizeNumericValue(y)
    const transform = [[x, 0, 0], [0, y, 0], [0, 0, 1]]
    return this.#createNextInstance(multiplyMatrices([...this], transform))
  }

  shear(x?: number, y?: number): TransformMatrix2D {
    x = normalizeNumericValue(x)
    y = normalizeNumericValue(y)
    const transform = [[1, x, 0], [y, 1, 0], [0, 0, 1]]
    return this.#createNextInstance(multiplyMatrices([...this], transform))
  }

  translate(x?: number, y?: number): TransformMatrix2D {
    x = normalizeNumericValue(x)
    y = normalizeNumericValue(y)
    const transform = [[1, 0, x], [0, 1, y], [0, 0, 1]]
    return this.#createNextInstance(multiplyMatrices([...this], transform))
  }

  #createNextInstance(matrix?: Matrix) {
    const next = new TransformMatrix2D(matrix)
    transformParents.set(next, this)
    return next
  }
}

export class Point2D implements Point {
  x = 0
  y = 0

  constructor(x?: number, y?: number) {
    this.x = normalizeNumericValue(x)
    this.y = normalizeNumericValue(y)

    Object.freeze(this) // make instance immutable
  }

  *[Symbol.iterator]() {
    yield this.x
    yield this.y
  }

  round(method = Math.round) {
    return new Point2D(method(this.x), method(this.y))
  }

  transform(matrix: Matrix | TransformMatrix2D) {
    const transformed = applyMatrixToPoint([...matrix], this)
    return Point2D.fromMatrix(transformed)
  }

  toString() {
    return `Point2D [x: ${this.x}, y: ${this.y}]`
  }

  static fromPoint({ x, y }: Partial<Point>) {
    return new Point2D(x, y)
  }

  static fromMatrix([[x], [y]]: Matrix) {
    return new Point2D(x, y)
  }

  static toRange(...points: Point[]) {
    return getPointRange(points)
  }
}

export class Size2D implements Size {
  width = 0
  height = 0

  constructor(width?: number, height?: number) {
    this.width = normalizeNumericValue(width)
    this.height = normalizeNumericValue(height)

    Object.freeze(this) // make instance immutable
  }

  *[Symbol.iterator]() {
    yield this.width
    yield this.height
  }

  round(method = Math.round) {
    return new Size2D(method(this.width), method(this.height))
  }

  transform(matrix: Matrix | TransformMatrix2D) {
    return Size2D.fromMatrix(applyMatrixToPoint([...matrix], { x: this.width, y: this.height }))
  }

  toString() {
    return `Size2D [width: ${this.width}, height: ${this.height}]`
  }

  static fromSize({ width, height }: Partial<Size>) {
    return new Size2D(width, height)
  }

  static fromMatrix([[width], [height]]: Matrix) {
    return new Size2D(width, height)
  }
}

export class Rect2D implements Rect {
  x = 0
  y = 0
  width = 0
  height = 0

  get left(): number {
    return this.x
  }
  get right(): number {
    return this.x + this.width
  }
  get top(): number {
    return this.y
  }
  get bottom(): number {
    return this.y + this.height
  }
  get center(): Point2D {
    return new Point2D(this.x + this.width / 2, this.y + this.height / 2)
  }
  get points(): Generator<Point2D> {
    return getRect2DCornerPoints(this)
  }

  constructor(x?: number, y?: number, width?: number, height?: number) {
    this.x = normalizeNumericValue(x)
    this.y = normalizeNumericValue(y)
    this.width = normalizeNumericValue(width)
    this.height = normalizeNumericValue(height)

    Object.freeze(this) // make instance immutable
  }

  *[Symbol.iterator]() {
    yield this.x
    yield this.y
    yield this.width
    yield this.height
  }

  round(method = Math.round) {
    return new Rect2D(method(this.x), method(this.y), method(this.width), method(this.height))
  }

  toString() {
    return `Rect2D [x: ${this.x}, y: ${this.y}, width: ${this.width}, height: ${this.height}]`
  }

  static fromRange({ min, max }: PointRange) {
    return new Rect2D(min.x, min.y, max.x - min.x, max.y - min.y)
  }

  static fromRect({ x, y, width, height }: Partial<Rect>) {
    return new Rect2D(x, y, width, height)
  }

  static fromPoints(...points: Point[]) {
    return Rect2D.fromRange(getPointRange(points))
  }
}

function getPointRange(points: Point[]): PointRange {
  const x = points.map(p => p.x)
  const y = points.map(p => p.y)
  const min = { x: Math.min(...x), y: Math.min(...y) }
  const max = { x: Math.max(...x), y: Math.max(...y) }

  return {
    min,
    max
  }
}

function* collectTransformStack(matrix: TransformMatrix2D): Generator<TransformMatrix2D, void, undefined> {
  yield matrix
  if (!transformParents.has(matrix)) return
  yield* collectTransformStack(transformParents.get(matrix)!)
}

export function* getRect2DCornerPoints(rect: Rect) {
  yield new Point2D(rect.x, rect.y)
  yield new Point2D(rect.x + rect.width, rect.y)
  yield new Point2D(rect.x + rect.width, rect.y + rect.height)
  yield new Point2D(rect.x, rect.y + rect.height)
}
