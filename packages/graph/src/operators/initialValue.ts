import { Node, getNodeControler, type NodeController } from '../node'

type WithInitialValue<T> = { initialValue: T }

export function initialValue<T>(value: T): (node: Node<T>) => typeof node {
  return (node: Node<T>): typeof node => {
    const next = Node.clone(node)
    const ctrl: NodeController<T> & WithInitialValue<T> = getNodeControler(next) as NodeController<T> & WithInitialValue<T>
    ctrl.identifier.assert(value)

    Object.assign(ctrl, {
      initialValue: value,
    })

    Object.assign(next, {
      async *[Symbol.asyncIterator]() {
        const iterator = node[Symbol.asyncIterator]
        yield ctrl.initialValue
        yield* iterator.call(next)
      },
    })

    return next
  }
}
