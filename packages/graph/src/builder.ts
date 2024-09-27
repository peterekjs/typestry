import { type Node } from './node'

// Type for functions that modify the `Node` and return a new `Node`.
type AnyFunc = (arg: any) => any

// Adjusted PipeArgs to ensure the function chain modifies the `Node` progressively.
type PipeArgs<F extends AnyFunc[], Acc extends AnyFunc[] = []> = F extends [
  (arg: infer A) => infer B,
]
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
type LastFnReturnType<F extends Array<AnyFunc>, Else = never> = F extends [
  ...any[],
  (arg: any) => infer R,
]
  ? R
  : Else

// The `buildNode` function takes an initial `Node` and a series of functions.
function buildNode<N extends Node, F extends AnyFunc[]>(
  node: N & Parameters<F[0]>[0], // Initial node with compatibility check for the first function
  ...fns: PipeArgs<F> extends F ? F : PipeArgs<F> // Ensure the functions chain progressively modifies the Node
): LastFnReturnType<F, ReturnType<F[0]>> {
  return fns.length ? (fns.slice(1) as AnyFunc[]).reduce((acc, fn) => fn(acc), fns.at(0)!(node)) : node
}

export { buildNode }
