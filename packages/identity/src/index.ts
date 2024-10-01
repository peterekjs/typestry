export type {
  PropDescriptors,
  TypeDescriptor,
  TypeFromDescriptor,
  TypeFromDescriptors,
  TypeFromIdentifier,
  TypeFromPropDescriptors,
  TypeIdentifier,
} from './definitions'
export * from './errors'
export { describeArray, describeInstance, describeObject, describePrimitive, describeType } from './describe'
export { createIdentifier } from './identifier'
export { intersectDescriptors, intersectIdentifiers, unionDescriptors, unionIdentifiers } from './merge'
export { pickProps, stripObject } from './helpers'

export * from './lib'
