import { normalizeNumericValue } from './common'

export function numeric<T>(
  { get, set }: ClassAccessorDecoratorTarget<T, number>,
  { kind }: ClassAccessorDecoratorContext<T, number>,
): ClassAccessorDecoratorResult<T, number> {
  if (kind !== 'accessor') {
    throw new TypeError('This decorator is allowed only for accessor kind')
  }

  return {
    get() {
      return get.call(this)
    },
    set(next: number) {
      set.call(this, normalizeNumericValue(next))
    },
    init(initialValue: number) {
      return normalizeNumericValue(initialValue)
    },
  }
}
