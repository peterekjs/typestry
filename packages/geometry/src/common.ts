import { $number } from '@typestry/identity'

export function normalizeNumericValue(value?: unknown): number {
  if (typeof value === 'undefined') return 0
  if (value === null) return 0
  if ($number.is(value)) return value
  return NaN
}
