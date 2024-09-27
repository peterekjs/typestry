import { $any, createIdentifier, describeInstance, type TypeIdentifier } from '@typestry/identity'
import { NODE_CONTROLLER } from './symbols'

type NodeOptions<T> = {
  identifier: TypeIdentifier<T>
  dispose?: () => void | Promise<void>
  updates?: () => AsyncIteratorObject<Awaited<T>>
}

type Operator<A extends Node, B extends Node> = (source: A) => B

export type FromNode<T extends Node> = T extends Node<infer R> ? R : never

// Type for functions that modify the `Node` and return a new `Node`.
type AnyFunc = (arg: any) => any

// Adjusted PipeArgs to ensure the function chain modifies the `Node` progressively.
type PipeArgs<F extends AnyFunc[], Acc extends AnyFunc[] = []> = F extends [(arg: infer A) => infer B]
  ? A extends Node
    ? B extends Node
      ? [...Acc, (arg: A) => B]
      : Acc
    : Acc
  : F extends [(arg: infer A) => any, ...infer Tail]
    ? Tail extends [(arg: infer B) => any, ...any[]]
      ? A extends Node
        ? B extends Node
          ? PipeArgs<Tail, [...Acc, (arg: A) => B]>
          : Acc
        : Acc
      : Acc
    : Acc

// Extract the return type of the last function in the chain.
type LastFnReturnType<F extends Array<AnyFunc>, Else = never> = F extends [...any[], (arg: any) => infer R] ? R : Else

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

  pipe<A extends Node>(a: Operator<this, A>): A
  pipe<A extends Node, B extends Node>(a: Operator<this, A>, b: Operator<A, B>): B
  pipe<A extends Node, B extends Node, C extends Node>(a: Operator<this, A>, b: Operator<A, B>, c: Operator<B, C>): C
  pipe<A extends Node, B extends Node, C extends Node, D extends Node>(a: Operator<this, A>, b: Operator<A, B>, c: Operator<B, C>, d: Operator<C, D>): D
  pipe<A extends Node, B extends Node, C extends Node, D extends Node, E extends Node>(a: Operator<this, A>, b: Operator<A, B>, c: Operator<B, C>, d: Operator<C, D>, e: Operator<D, E>): E
  pipe<A extends Node, B extends Node, C extends Node, D extends Node, E extends Node, F extends Node>(a: Operator<this, A>, b: Operator<A, B>, c: Operator<B, C>, d: Operator<C, D>, e: Operator<D, E>, f: Operator<E, F>): F
  pipe<A extends Node, B extends Node, C extends Node, D extends Node, E extends Node, F extends Node, G extends Node>(a: Operator<this, A>, b: Operator<A, B>, c: Operator<B, C>, d: Operator<C, D>, e: Operator<D, E>, f: Operator<E, F>, g: Operator<F, G>): G
  pipe<A extends Node, B extends Node, C extends Node, D extends Node, E extends Node, F extends Node, G extends Node, H extends Node>(a: Operator<this, A>, b: Operator<A, B>, c: Operator<B, C>, d: Operator<C, D>, e: Operator<D, E>, f: Operator<E, F>, g: Operator<F, G>, h: Operator<G, H>): H
  pipe<A extends Node, B extends Node, C extends Node, D extends Node, E extends Node, F extends Node, G extends Node, H extends Node, I extends Node>(a: Operator<this, A>, b: Operator<A, B>, c: Operator<B, C>, d: Operator<C, D>, e: Operator<D, E>, f: Operator<E, F>, g: Operator<F, G>, h: Operator<G, H>, i: Operator<H, I>): I
  pipe<F extends AnyFunc[]>(
    ...operators: PipeArgs<F> extends F ? F : PipeArgs<F> // Ensure the functions chain progressively modifies the Node
  ) {
    return operators.length ? operators.reduce((acc, fn) => fn(acc), this) : this
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

export type { NodeController, NodeOptions, Operator }
export { $Node, Node, getNodeControler }
