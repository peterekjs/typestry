import { Empty } from '../common'
import { FromNode, Node, getNodeControler, type NodeController } from '../node'
import { EMPTY_VALUE } from '../symbols'

export type WithState<T> = { state: T | Empty }

export function stateful<TNode extends Node>(): (node: TNode) => NoInfer<TNode> & WithState<FromNode<NoInfer<TNode>>> {
  return (node: TNode): NoInfer<TNode> & WithState<FromNode<NoInfer<TNode>>> => {
    type T = TNode extends Node<infer R> ? R : never
    const next = Node.clone(node) as TNode & WithState<FromNode<TNode>>
    const ctrl: NodeController<T> & WithState<T> = getNodeControler(next) as NodeController<T> & WithState<T>

    let state: T | Empty = EMPTY_VALUE
    if ('initialValue' in ctrl) state = (ctrl.initialValue as T)

    const statePropertyDescriptor = {
      get() {
        return state
      },
      set(value: T) {
        ctrl.identifier.assert(value)
        state = value
      },
    }

    Object.assign(next, {
      async *[Symbol.asyncIterator]() {
        const iterator = node[Symbol.asyncIterator]
        if (state !== EMPTY_VALUE) yield state
        for await (const value of iterator.call(next)) {
          state = (value as T)
          yield value
        }
      },
    })
    Object.defineProperty(next, 'state', statePropertyDescriptor)
    Object.defineProperty(ctrl, 'state', statePropertyDescriptor)

    return next
  }
}

export function getStatefulNodeController<T>(node: Node<T>): NodeController<T> & WithState<T> {
  const ctrl = getNodeControler(node)
  if (Reflect.has(ctrl, 'state')) {
    return ctrl as NodeController<T> & WithState<T>
  }

  node = stateful<Node<T>>()(node)
  return getNodeControler(node) as NodeController<T> & WithState<T>
}
