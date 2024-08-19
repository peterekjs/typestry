import { describe, expect, test } from 'vitest'
import { TransformMatrix2D, Point2D } from './2d'
import { applyMatrixToPoint, multiplyMatrices } from './matrix'


describe('matrix', () => {
  test('multiplyMatrices', () => {
    const A = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    const B = [[2, 2], [3, 3]];

    expect(multiplyMatrices(A, B)).to.eql([[2, 2], [3, 3], [0, 0]])
  })

  test('multiplyMatrices multiple', () => {
    const A = [[1, 0, 3.5], [0, 1, 2.5], [0, 0, 1]];
    const B = [[0.5, -0.866, 0], [0.866, 0.5, 0], [0, 0, 1]];
    const C = [[1, 0, -3.5], [0, 1, -2.5], [0, 0, 1]];

    const R = [[0.5, -0.866, 3.915], [0.866, 0.5, -1.7810000000000006], [0, 0, 1]];

    expect(multiplyMatrices(A, B, C)).to.eql(R)
  })

  test('apply2DMatrix', () => {
    const matrix = new TransformMatrix2D([[1, 0, 1], [0, 1, 2]])
    const point = new Point2D(0, 0)

    const pointMatrix = applyMatrixToPoint([...matrix], point)
    expect(pointMatrix).to.eql([[1], [2], [1]])

    const transformedPoint = Point2D.fromMatrix(pointMatrix)
    expect(transformedPoint.x).to.eq(1)
    expect(transformedPoint.y).to.eq(2)
  })
})
