import type { TypeDescription } from './definitions'

function mergeTypes<T extends TypeDescription<any>[]>(
  ...descriptions: T
): T[number] extends TypeDescription<infer S> ? TypeDescription<S> : never {
  function validate(input: unknown) {
    return descriptions.some((x) => x.validate(input))
  }

  return {
    name: descriptions.map((x) => x.name).join(' | '),
    validate,
    equals(a, b) {
      return descriptions.some((d) => d.equals(a, b))
    },
    get isObject() {
      return descriptions.some((x) => x.isObject)
    },
    get props() {
      return descriptions.map((x) => x.props).flat()
    },
  } as T[number] extends TypeDescription<infer S> ? TypeDescription<S> : never
}

export { mergeTypes }
