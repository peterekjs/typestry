import { SYMBOL_DESCRIPTOR } from './definitions'
import type { MergedDescriptor, MergedIdentifier, TypeDescriptor, TypeIdentifier } from './definitions'
import { createIdentifier } from './identifier'

function* mergeProps<T extends TypeDescriptor<any>[]>(descriptions: T) {
  for (const { props } of descriptions) {
    yield* props ?? []
  }
}

function* collectDescriptors(identifiers: Iterable<TypeIdentifier<any>>) {
  for (const identifier of identifiers) {
    if (!identifier?.[SYMBOL_DESCRIPTOR]) {
      throw new ReferenceError('TypeDescriptor does not exist', { cause: identifiers })
    }
    yield identifier[SYMBOL_DESCRIPTOR]
  }
}

function mergeDescriptors<T extends TypeDescriptor<any>[]>(...descriptors: T): MergedDescriptor<T> {
  function validate(input: unknown) {
    return descriptors.some((x) => x.validate(input))
  }

  const name = descriptors.map((x) => x.name).join(' | ')
  const primitive = descriptors.every((x) => x.primitive)

  return {
    name,
    validate,
    equals(a, b) {
      if (!(validate(a) && validate(b))) {
        throw new TypeError(`Equality check for type ${name} failed`, { cause: { a, b } })
      }

      for (const descriptor of descriptors) {
        try {
          if (descriptor.equals(a, b)) return true
        } catch (e) {
          // We don't need to handle separate equality errors as the type validation happened at the begining of this method.
        }
      }

      return false
    },
    get primitive() {
      return primitive
    },
    get props() {
      return primitive ? null : new Set(mergeProps(descriptors))
    },
  } as MergedDescriptor<T>
}

function mergeIdentifiers<T extends TypeIdentifier<any>[]>(...identifiers: T): MergedIdentifier<T> {
  return createIdentifier(mergeDescriptors(...collectDescriptors(identifiers))) as MergedIdentifier<T>
}

export { mergeDescriptors, mergeIdentifiers }
