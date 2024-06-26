import type { MergedDescriptor, MergedIdentifier, TypeDescriptor, TypeIdentifier } from './definitions'
import { createIdentifier } from './identifier'

function* mergeProps<T extends TypeDescriptor<any>[]>(descriptions: T) {
  for (const { props } of descriptions) {
    yield* props
  }
}

function mergeDescriptors<T extends TypeDescriptor<any>[]>(...descriptions: T): MergedDescriptor<T> {
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
  } as MergedDescriptor<T>
}

function mergeIdentifiers<T extends TypeIdentifier<any>[]>(...identifiers: T): MergedIdentifier<T> {
  return createIdentifier(mergeDescriptors(...identifiers.map((x) => x.descriptor)) as any) as MergedIdentifier<T>
}

export { mergeDescriptors, mergeIdentifiers }
