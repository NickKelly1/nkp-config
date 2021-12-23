/**
 * Logic tree where each node may have many connections but must
 * be of either "and" or "or" type, or a leaf
 */
export namespace Tree {
  /**
   * Disjointed union of all node types
   */
  export type Node<V> = | Edge<V> | Leaf<V>;

  /**
   * Disjointed union of all edge types
   */
  export type Edge<V> = | And<V> | Or<V>;

  /**
   * Root of the reason tree
   */
  export interface Tree<V> {
    node: Node<V>;
  }

  /**
   * Create a new "Leaf" node
   *
   * @param value     leav vale
   * @returns         leaf node
   */
  export function leaf<V>(value: V): Leaf<V> {
    return {
      type: NodeType.Leaf,
      value,
    }
  }

  /**
   * Create a new "And" node
   * 
   * @returns     new "And" node
   */
  export function and<V>(values: Node<V>[] = []): And<V> {
    return {
      type: NodeType.Edge,
      conjunction: Conjunction.And,
      value: values,
    }
  }

  /**
   * Create a new "Or" node
   * 
   * @returns     new "Or" node
   */
  export function or<V>(values: Node<V>[] = []): Or<V> {
    return {
      type: NodeType.Edge,
      conjunction: Conjunction.Or,
      value: values,
    }
  }

  /**
   * `conjunction` type of an edge
   */
  export enum Conjunction {
    And = 'And',
    Or = 'Or',
  }

  /**
   * `type` of a node
   */
  export enum NodeType {
    Edge = 'Edge',
    Leaf = 'Leaf',
  }

  /**
   * Base type for a node
   */
  export interface NodeBase<V, T extends NodeType> {
    type: T;
    value: V;
  }

  /**
   * Base type for an edge
   */
  export interface EdgeBase<V, C extends Conjunction>
    extends NodeBase<Node<V>[], NodeType.Edge>
  {
    conjunction: C;
  }

  /**
   * Edge of reasons which ought to be true
   */
  export interface And<V> extends EdgeBase<V, Conjunction.And> {}

  /**
   * Edge of reasons any of which ought to have been true
   */
  export interface Or<V> extends EdgeBase<V, Conjunction.Or> {}

  /**
   * Leaf node of a single reason
   */
  export interface Leaf<V> extends NodeBase<V, NodeType.Leaf> {}

  /**
   * IS the node a leaf?
   * 
   * @param node      the node
   * @returns         whether it's a leaf
   */
  export function isLeaf<V>(node: Node<V>): node is Leaf<V> {
    return node.type === NodeType.Leaf;
  }

  /**
   * Is the node an edge?
   * 
   * @param node    the node
   * @returns       whether the node is an edge
   */
  export function isEdge<V>(node: Node<V>): node is Edge<V> {
    return node.type === NodeType.Edge;
  }

  /**
   * Is the edge an "and"?
   * 
   * @param edge    the edge
   * @returns       whether the edge is an "and"
   */
  export function isAnd<V>(edge: Edge<V>): edge is And<V> {
    return edge.conjunction === Conjunction.And;
  }

  /**
   * Is the edge an "or"?
   * 
   * @param edge    the edge
   * @returns       whether the edge is an "or"
   */
  export function isOr<V>(edge: Edge<V>): edge is Or<V> {
    return edge.conjunction === Conjunction.Or;
  }
}