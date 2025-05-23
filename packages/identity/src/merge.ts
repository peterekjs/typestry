import { SYMBOL_DESCRIPTOR } from './definitions'
import type { Intersect, PropDescriptors, TypeDescriptor, TypeDescriptorIntersection, TypeDescriptorUnion, TypeFromDescriptor, TypeIdentifier, TypeIdentifierIntersection, TypeIdentifierUnion } from './definitions'
import { createIdentifier } from './identifier'

function *mergeProps<T extends TypeDescriptor<any>[]>(descriptors: T) {
  for (const { props } of descriptors) {
    yield* props ?? []
  }
}

function *collectDescriptors(identifiers: Iterable<TypeIdentifier<any>>) {
  for (const identifier of identifiers) {
    if (!identifier?.[SYMBOL_DESCRIPTOR]) {
      throw new ReferenceError('TypeDescriptor does not exist', { cause: identifiers })
    }
    yield identifier[SYMBOL_DESCRIPTOR]
  }
}

function intersectDescriptors<T extends TypeDescriptor<any>[]>(...descriptors: T): TypeDescriptorIntersection<T> {
  const uniqueNames = new Set(descriptors.map(x => x.name))
  const name = uniqueNames.size > 1 ? 'never' : [...uniqueNames].join(' & ')
  const primitive = descriptors.every(x => x.primitive)

  function validate(input: unknown): input is Intersect<TypeFromDescriptor<T[number]>> {
    return descriptors.every(x => x.validate(input))
  }

  return {
    name,
    validate,
    equals(a, b) {
      if (!(validate(a) && validate(b))) {
        throw new TypeError(`Equality check for type ${name} failed`, { cause: { a, b } })
      }

      return descriptors.every(descriptor => descriptor.equals(a, b))
    },
    get primitive() {
      return primitive
    },
    get props() {
      return (
        primitive
          ? null
          : (new Set(mergeProps(descriptors)) satisfies Set<keyof TypeFromDescriptor<T[number]>>)
      ) as Intersect<TypeFromDescriptor<T[number]>> extends object ? Set<keyof Intersect<TypeFromDescriptor<T[number]>>> : null
    },
    get propDescriptors() {
      return recursiveIntersectPropDescriptors(descriptors)
    },
  } satisfies TypeDescriptorIntersection<T>
}

function recursiveIntersectPropDescriptors<T extends TypeDescriptor<any>[]>(descriptors: T): PropDescriptors<Intersect<TypeFromDescriptor<T[number]>>> {
  const stash = new Map()
  const merged: PropDescriptors<any> = {}

  for (const { propDescriptors } of descriptors) {
    for (const [prop, descriptor] of Object.entries(propDescriptors)) {
      if (!stash.has(prop)) stash.set(prop, new Set())
      stash.get(prop)!.add(descriptor)
    }
  }

  for (const [prop, descriptors] of stash) {
    merged[prop] = descriptors.size > 1 ? intersectDescriptors(...descriptors) : [...descriptors].at(0)
  }

  return merged
}

function intersectIdentifiers<T extends TypeIdentifier<any>[]>(...identifiers: T): TypeIdentifierIntersection<T> {
  return createIdentifier(intersectDescriptors(...collectDescriptors(identifiers))) as TypeIdentifierIntersection<T>
}

function unionDescriptors<T extends TypeDescriptor<any>[]>(...descriptors: T): TypeDescriptorUnion<T> {
  const uniqueNames = new Set(descriptors.map(x => x.name))
  const name = [...uniqueNames].join(' | ')
  const primitive = descriptors.every(x => x.primitive)

  function validate(input: unknown): input is TypeFromDescriptor<T[number]> {
    return descriptors.some(x => x.validate(input))
  }

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
        }
        catch (e) {
          // We don't need to handle separate equality errors as the type validation happened at the begining of this method.
        }
      }

      return false
    },
    get primitive() {
      return primitive
    },
    get props() {
      return (
        primitive
          ? null
          : (new Set(mergeProps(descriptors)) satisfies Set<keyof TypeFromDescriptor<T[number]>>)
      ) as TypeFromDescriptor<T[number]> extends object ? Set<keyof TypeFromDescriptor<T[number]>> : null
    },
    get propDescriptors() {
      return recursiveUnionPropDescriptors(descriptors)
    },
  } satisfies TypeDescriptorUnion<T>
}

function recursiveUnionPropDescriptors<T extends TypeDescriptor<any>[]>(descriptors: T): PropDescriptors<TypeFromDescriptor<T[number]>> {
  const stash = new Map()
  const merged: PropDescriptors<any> = {}

  for (const { propDescriptors } of descriptors) {
    for (const [prop, descriptor] of Object.entries(propDescriptors)) {
      if (!stash.has(prop)) stash.set(prop, new Set())
      stash.get(prop)!.add(descriptor)
    }
  }

  for (const [prop, descriptors] of stash) {
    merged[prop] = descriptors.size > 1 ? unionDescriptors(...descriptors) : [...descriptors].at(0)
  }

  return merged
}

function unionIdentifiers<T extends TypeIdentifier<any>[]>(...identifiers: T): TypeIdentifierUnion<T> {
  return createIdentifier(unionDescriptors(...collectDescriptors(identifiers))) as TypeIdentifierUnion<T>
}

export { intersectDescriptors, intersectIdentifiers, unionDescriptors, unionIdentifiers }
