export type Point = {
  x: number
  y: number
}

export type Size = {
  width: number
  height: number
}
export type Rect = Point & Size

export type PointRange = {
  min: Point
  max: Point
}

export type Matrix = number[][]
