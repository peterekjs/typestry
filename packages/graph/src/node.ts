import { $any, createIdentifier, describeInstance, type TypeIdentifier } from '@typestry/identity'
import { NODE_CONTROLLER } from './symbols'

type NodeOptions<T> = {
  identifier: TypeIdentifier<T>
  dispose?: () => void | Promise<void>
  updates?: () => AsyncIteratorObject<Awaited<T>>
}

async function *updates() {}

class NodeController<T = any> implements NodeOptions<T> {
  identifier: TypeIdentifier<T>
  dispose: () => void | Promise<void> = () => void 0
  updates: () => AsyncIteratorObject<Awaited<T>> = updates

  constructor(options: NodeOptions<T>) {
    this.identifier = options.identifier
    if (typeof options.dispose === 'function') this.dispose = options.dispose
    if (typeof options.updates === 'function') this.updates = options.updates
  }

  static create<T>(options: NodeOptions<T>): NodeController<T> {
    return new NodeController(options)
  }
}

class Node<T = any> implements AsyncIterable<T>, Disposable, AsyncDisposable {
  [NODE_CONTROLLER] = NodeController.create({ identifier: $any })

  get identifier() {
    return getNodeControler(this).identifier
  }

  constructor(node?: Node<T>) {
    if (!node) return
    Object.assign(this, node)
    this[NODE_CONTROLLER] = NodeController.create(getNodeControler(node))
  }

  async *[Symbol.asyncIterator]() {
    const ctrl = getNodeControler(this)
    for await (const value of ctrl.updates()) {
      if (!ctrl.identifier.is(value)) continue
      yield value
    }
  }

  [Symbol.dispose]() {
    getNodeControler(this).dispose()
  }

  async [Symbol.asyncDispose]() {
    await getNodeControler(this).dispose()
  }

  static create<T = any>(options: NodeOptions<T>): Node<T> {
    const node = new Node<T>()
    node[NODE_CONTROLLER] = NodeController.create(options)
    return node
  }

  static clone<T>(node: Node<T>): Node<T> {
    return new Node<T>($Node.ensure(node))
  }
}

const $Node = createIdentifier(describeInstance(Node))

function hasNodeController<T>(input: unknown): input is Node<T> & { [NODE_CONTROLLER]: NodeController<T> } {
  return !!input && Reflect.has(input, NODE_CONTROLLER)
}

function getNodeControler<T>(node: Node<T>): NodeController<T> {
  if (!hasNodeController<T>(node)) {
    throw new TypeError('Expected Node interface')
  }

  return node[NODE_CONTROLLER]
}

export type { NodeController, NodeOptions }
export { $Node, Node, getNodeControler }
