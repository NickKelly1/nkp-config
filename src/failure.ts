import { Tree } from "./tree";
import { indent } from "./utils";

/**
 * Represents a reason that parsing failed
 */
export interface Failure {
  /**
   * Is this reason equivalent to that reason?
   *
   * Used to eliminate duplicates
   * 
   * @param otherReason 
   */
  eq?(otherReason: this): boolean;

  /**
   * Human friendly string of the reason
   */
  toString(): string;
}

export namespace Failure {
  /**
   * Basic vanilla failure instance
   */
  export class Basic implements Failure {
    constructor(protected readonly string: string) {}

    /** @inheritdoc */
    eq(that: Basic) {
      // in the baseic case, two failure reasons are
      // equivalent if their strings are equal
      return that.toString() === this.toString();
    }

    /** @inheritdoc */
    toString(): string {
      return this.string;
    }
  }

  // failure reason: is not set
  export const isNotSet = 'Must be set.';

  /**
   * Create a new failure reason
   * 
   * @param string    human-readable reason
   * @returns 
   */
  export function create(string: string): Basic {
    return new Basic(string);
  }

  /**
   * list of faiure reasons
   */
  export type Group = Tree.Edge<Failure>;

  /**
   * Note a reason for failure
   * 
   * @param reason    the single reason parsing failed
   * @returns         failure node
   */
  export function single(reason: Failure): Tree.Leaf<Failure> {
    return Tree.leaf(reason);
  }

  /**
   * @param failures  for success all of these failures must be resolved
   * @returns         list of failure reasons
   */
  export function all(failures: Failure[] = []): Group {
    return Tree.and<Failure>(failures.map(Tree.leaf));
  }

  /**
   * @param failures  for success any of these failures must be resolved
   * @returns         list of failure reasons
   */
  export function any(failures: Failure[] = []): Group {
    return Tree.or<Failure>(failures.map(Tree.leaf));
  }

  /**
   * Add a failure reason to the group
   *
   * @param failures
   * @param reason
   */
  export function add(failures: Group, reason: Failure) {
    failures.value.push(Tree.leaf(reason));
  }

  /**
   * Is the group of failure reasons empty? (are we on a sucecss path?)
   * 
   * @param group 
   */
  export function empty(group: Group): boolean {
    return group.value.length === 0;
  }

  /**
   * Stringify a tree of failure reasons
   * 
   * @param node    base of the tree
   */
  export function stringify(node: Tree.Node<Failure>): string {
    return stringify.handleNode(node, 0);
  }

  /**
   * Static functions used in stringify
   */
  export namespace stringify {
    /**
     * stringify a node
     * 
     * @param node 
     * @param indentation 
     * @returns 
     */
    export function handleNode(node: Tree.Node<Failure>, indentation: number): string {
      if (Tree.isLeaf(node)) return handleLeaf(node, indentation);
      return handleEdge(node, indentation);
    }

    /**
     * Stringify a "leaf" node
     * 
     * @param leaf 
     * @param indentation 
     * @returns 
     */
    export function handleLeaf(leaf: Tree.Leaf<Failure>, indentation: number): string {
      return indent(indentation) + leaf.value.toString();
    }

    /**
     * Stringify an "edge" node
     * 
     * @param edge 
     * @param indentation 
     * @returns 
     */
    export function handleEdge(edge: Tree.Edge<Failure>, indentation: number): string {
      if (Tree.isAnd(edge)) return handleAnd(edge, indentation);
      return handleOr(edge);
    }

    /**
     * Stringify an "And" edge
     * 
     * @param ands 
     * @param indentation 
     * @returns 
     */
    export function handleAnd(ands: Tree.And<Failure>, indentation: number): string {
      switch (ands.value.length) {
        case 0: return '';
        case 1: return handleNode(ands.value[0]!, indentation);
        default: return indent(indentation)
          + 'and:'
          + '\n' + ands
            .value
            .map(subnode => handleNode(subnode, indentation + 2))
            .join('\n')
      }
    }

    /**
     * Stringify an "Or" edge
     * 
     * @param ors 
     * @param indentation 
     * @returns 
     */
    export function handleOr(ors: Tree.Or<Failure>, indentation = 0): string {
      switch (ors.value.length) {
        case 0: return '';
        case 1: return handleNode(ors.value[0]!, indentation);
        default: return indent(indentation)
          + 'or:'
          + '\n' + ors
            .value
            .map(subnode => handleNode(subnode, indentation + 2))
            .join('\n')
      }
    }
  }


  /**
   * Standardised failure message for when a parsing was partially successful
   * 
   * @param reason        message denoting the failure reason
   * @param original      the original value
   * @param parsedTo      the final parsed state of the value before failure
   */
  export function message(
    reason: string,
    original: unknown,
    parsedTo: unknown,
  ): string {
    return `${reason}. ${message.resolvedTo(original, parsedTo)}`;
  }

  /**
   * Static functions for failure message
   */
  export namespace message {
    /**
     * Note what we resolved the value to
     * 
     * Useful for providing a failure reason in an unsuccessful parse
     * 
     * @param original      original un-parsed value
     * @param to            value we parsed to before failing
     * @returns             string denoting the resolution state
     */
    export function resolvedTo(original: unknown, to: unknown): string {
      let toString;
      try { toString = (to as any)?.toString() ?? String(to); }
      catch (err: any) { toString = stringifyingError(to, err); }
      return `Reolved ${stringify(original)} as ${toString}`;
    }

    /**
     * Safely stringify unknown type for notifying consumers
     * 
     * @param unk 
     * @returns 
     */
    function stringify(unk: unknown): string {
      switch (typeof unk) {
        case 'bigint': return `"${unk.toString()}" (typeof ${typeof unk})`;
        case 'boolean': return `"${unk.toString()}" (typeof ${typeof unk})`
        case 'function': return `"[Function: ${unk.name}]" (typeof ${typeof unk})`
        case 'number': return `"${unk.toString()}" (typeof ${typeof unk})`
        case 'object': {
          if (unk === null) {
            return `"null" (typeof ${typeof unk})`
          }
          // constructor may be undefined for objects inheriting null
          return `"[Object: ${unk.constructor?.name}]" (typeof ${typeof unk})`
        }
        case 'string': return `"${unk.toString()}" (typeof ${typeof unk})`
        case 'symbol': return `"${unk.toString()}" (typeof ${typeof unk})`
        case 'undefined': return `"undefined" (typeof ${typeof unk})`
      }

      // some other type?
      try {
        return `"${String(unk)}" {typeof ${typeof unk}}`;
      } catch (err: any) {
        // something seriously unexpected and wrong...
        // don't cause the application to crash but do log out warning
        return stringifyingError(unk, err);
      }
    }

    /**
     * Handle objects that can't be stringified
     *
     * @param unk     unknown unstringifyable object
     * @param err     error from stringifying
     */
    function stringifyingError(unk: unknown, err: any) {
      console.error(`ERROR @nkp/config errored stringifying object of type ${typeof unk}`);
      return `___ ERRORED ${err?.name} ${err?.message} ___`;
    }
  }
}
