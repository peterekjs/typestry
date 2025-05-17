import { TypeIdentifier } from '../definitions'
import { unionIdentifiers } from '../merge'
import { $nil } from './derivates'

export type Maybe<T> = T | undefined | null

export function maybe<T>(identifier: TypeIdentifier<T>): TypeIdentifier<Maybe<T>> {
  return unionIdentifiers(identifier, $nil)
}
