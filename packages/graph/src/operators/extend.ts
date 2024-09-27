import { Node } from '../node'

export function extend<TNode extends Node, TExtension extends object>(extender: (node: TNode) => TExtension): ((node: TNode) => TNode & TExtension) {
  return node => Object.assign(Node.clone(node) as TNode, extender(node))
}
