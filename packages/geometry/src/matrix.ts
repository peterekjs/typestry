import type { Matrix, Point } from './definitions'

export function applyMatrixToPoint(matrix: Matrix, point: Point) {
  return multiplyMatrices(matrix, [[point.x], [point.y], [1]])
}

export function multiplyMatrices(A: Matrix, B: Matrix, ...rest: Matrix[]) {
  const rowsA = A.length
  const colsA = getMatrixColsSize(A)
  const rowsB = B.length
  const colsB = getMatrixColsSize(B)

  // Find the maximum rows and columns to pad both matrices
  const maxRows = Math.max(rowsA, colsB) // for the resulting matrix
  const maxCols = Math.max(colsA, rowsB) // for multiplication compatibility

  // Pad both matrices to make them compatible
  A = padMatrix(A, maxRows, maxCols)
  B = padMatrix(B, maxCols, maxRows)

  const result: Matrix = Array(rowsA).fill(null).map(() => Array(colsB).fill(0))

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        result[i][j] += A[i][k] * B[k][j]
      }
    }
  }

  if (!rest.length) return result

  const [C, ...next] = rest
  return multiplyMatrices(result, C, ...next)
}

export function padMatrix(matrix: Matrix, targetRows: number, targetCols: number): Matrix {
  const paddedMatrix = matrix.map((row) => {
    // Pad rows with zeros until they reach the target number of columns
    return [...row, ...Array(targetCols - row.length).fill(0)]
  })
  // Add new rows of zeros if the matrix has fewer rows than the target
  while (paddedMatrix.length < targetRows) {
    paddedMatrix.push(Array(targetCols).fill(0))
  }
  return paddedMatrix
}

function getMatrixColsSize(matrix: Matrix) {
  let length = 0
  for (const row of matrix) {
    if (row.length > length) length = row.length
  }
  return length
}
