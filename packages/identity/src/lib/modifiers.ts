import { TypeIdentifier } from '../definitions'
import { unionIdentifiers } from '../merge'
import { $nil } from './derivates'

function maybe<T>(identifier: TypeIdentifier<T>): TypeIdentifier<T | undefined | null> {
  return unionIdentifiers(identifier, $nil)
}

export { maybe }
