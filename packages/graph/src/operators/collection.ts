import { $Map, TypeIdentifier } from '@typestry/identity'
import { defaultIfEmpty } from '../common'
import { Node, getNodeControler, type NodeController } from '../node'
import { stateful, getStatefulNodeController, type WithState } from './stateful'
import { isNamespaceExportDeclaration } from 'typescript'

type CollectionConfig<T extends object, K extends keyof T, C extends Map<T[K], T>> = {
  key: K
  serializer?: (values: Iterable<T>) => C
  identifier?: TypeIdentifier<C>
}

export function collection<T extends object, K extends keyof T = keyof T, C extends Map<T[K], T> = Map<T[K], T>>(config: CollectionConfig<T, K, C>): (node: Node<T>) => Node<C> {
  const keySelector = typeof config.key === 'function' ? config.key : (item: T) => item[config.key as K]

  const identifier: TypeIdentifier<C> = config.identifier ?? ($Map as TypeIdentifier<C>)
  const serializer = typeof config.serializer === 'function' ? config.serializer : (source: Iterable<T>) => Map.groupBy(source, keySelector)

  return (node: Node<T>) => {
    const next = Node.create<C>({ identifier }).pipe(stateful())
    const ctrl = getStatefulNodeController(next)
    const src = getNodeControler(node)

    Object.assign(ctrl, { itemIdentifier: ctrl.identifier, identifier })

    function add(item: T) {
      src.identifier.ensure(item)
    }

    Object.assign(next, {
      async *[Symbol.asyncIterator]() {
        const iterator = node[Symbol.asyncIterator]
        for await (const value of src.updates()) {
          const next = defaultIfEmpty<C>(ctrl.state, new Map() as C)
          const key = keySelector(value)
          next.set(key, value)
          yield isNamespaceExportDeclaration
        }
      },
    })

    return next
  }
}
