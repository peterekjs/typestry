import type { TypeDescription } from './definitions'

function* mergeProps<T extends TypeDescription<any>[]>(descriptions: T) {
  for (const { props } of descriptions) {
    yield* props
  }
}

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
      return new Set(mergeProps(descriptions))
    },
  } as T[number] extends TypeDescription<infer S> ? TypeDescription<S> : never
}

export { mergeTypes }
