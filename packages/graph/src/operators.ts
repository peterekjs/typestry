import { Node, getNodeControler, type NodeController } from './node'
import { EMPTY_VALUE } from './symbols'

type WithInitialValue<T> = { initialValue: T }
type WithState<T> = { state: T | typeof EMPTY_VALUE }

function extend<TNode extends Node, TExtension extends object>(extender: (node: TNode) => TExtension): ((node: TNode) => TNode & TExtension) {
  return (node) => Object.assign(Node.clone(node) as TNode, extender(node))
}

function initialValue<T>(value: T): (node: Node<T>) => typeof node {
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
      }
    })

    return next
  }
}

function stateful<T>() {
  return (node: Node<T>): typeof node => {
    const next = Node.clone(node)
    const ctrl: NodeController<T> & WithState<T> = getNodeControler(next) as NodeController<T> & WithState<T>

    let state: T | typeof EMPTY_VALUE = EMPTY_VALUE
    if ('initialValue' in ctrl) state = (ctrl.initialValue as T)

    Object.assign(ctrl, { state })

    Object.assign(next, {
      async *[Symbol.asyncIterator]() {
        const iterator = node[Symbol.asyncIterator]
        if (ctrl.state !== EMPTY_VALUE) yield ctrl.state
        for await (const value of iterator.call(next)) {
          ctrl.state = value
          yield value
        }
      }
    })

    return next
  }
}

const sharedNodes = new WeakMap<Node, NodeController>()

function shared<T>() {
  return (node: Node<T>): typeof node => {
    return node
  }
}

export { extend, initialValue, stateful }
