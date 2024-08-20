import { $number, createIdentifier, describeObject, type TypeIdentifier } from '@typestry/identity'
import type { Point, PointRange, Size, Rect } from './definitions'

const $Point: TypeIdentifier<Point> = createIdentifier(describeObject<Point>('Point', {
  x: $number,
  y: $number
}))

const $PointRange: TypeIdentifier<PointRange> = createIdentifier(describeObject<PointRange>('PointRange', {
  max: $Point,
  min: $Point,
}))

const $Size: TypeIdentifier<Size> = createIdentifier(describeObject<Size>('Size', {
  width: $number,
  height: $number,
}))

const $Rect: TypeIdentifier<Rect> = createIdentifier(describeObject<Rect>('Rect', {
  ...$Point.props,
  ...$Size.props,
}))

export { $Point, $PointRange, $Rect, $Size }
