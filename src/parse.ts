import { Result } from './result';
import { Logic } from './logic';
import { indent } from './utils';

/**
 * Represents of parsing values
 */
export namespace Parse {
  /**
   * Output when parsing fails
   */
  export type Fail = Logic.Statement<Fail.Reason>;

  /**
   * Output when parsing fails
   */
  export type Failable = string | Fail;

  /**
   * Output result from parsing a value
   */
  export type Output<T> = Result<T, Fail>;

  /**
   * Parsing failed on this point
   */
  export const success = Result.success as (<T>(value: T) => Parse.Output<T>);

  /**
   * Parsing failed on this point
   *
   * @param reason    reason parsing failed
   * @returns         result type representing the failure
   */
  export function fail(reason: Failable): Result.Fail<Fail> {
    const f = typeof reason === 'string'
      ? Logic.Statement.value(reason)
      : reason;
    return Result.fail(f);
    // why isn't this working with tests?
    // return Result.fail(Parse.Fail.to(reason));
  }

  /**
   * Did parsing succeed?
   */
  export const isSuccess = Result.isSuccess as (<T>(output: Parse.Output<T>) => output is Result.Success<T>);

  /**
   * Did parsing fail?
   */
  export const isFail = Result.isFail as (<T>(output: Parse.Output<T>) => output is Result.Fail<Fail>);

  export namespace Fail {
    export type Reason = string;

    // failure reason: is not set
    export const isNotSet: Result.Fail<Parse.Fail> = Parse.fail('Must be defined.');


    /**
     * Convert a Failable to a Fail
     *
     * @param failable
     * @returns
     */
    export function to(failable: Failable): Fail {
      if (typeof failable === 'string') return Logic.Statement.value(failable);
      return failable;
    }


    /**
     * Did parsing fail?
     */
    export const is = isFail;


    /**
     * @param failures  for success all of these failures must be resolved
     * @returns         list of failure reasons
     */
    export function all(failures: Reason[] = []): Logic.Statement.Connective.Conjunction<Reason> {
      return Logic.Statement.Connective.conjunction<Reason>(failures.map(Logic.Statement.value));
    }


    /**
     * @param failures  for success any of these failures must be resolved
     * @returns         list of failure reasons
     */
    export function any(failures: Reason[] = []): Logic.Statement.Connective.Disjunction<Reason> {
      return Logic.Statement.Connective.disjunction<Reason>(failures.map(Logic.Statement.value));
    }


    /**
     * Add a failure reason to the group
     *
     * @param failures
     * @param reason
     */
    export function add(failures: Logic.Statement.Connective<Reason>, reason: Failable) {
      failures.value.push(to(reason));
    }

    /**
     * Is the connective of failure reasons empty? (Are there no failures)
     *
     * @param group
     */
    export function isEmpty(group: Logic.Statement.Connective<Reason>): boolean {
      return group.value.length === 0;
    }

    /**
     * Stringify a tree of failure reasons
     *
     * @param node    base of the tree
     */
    export function stringify(node: Logic.Statement<Reason>): string {
      const condensed = Logic.Statement.condense(node, { id: (reason) => reason, });
      return stringify.handleStatement(condensed, 0);
    }

    /**
     * Static functions used in stringify
     */
    export namespace stringify {
      /**
       * Stringify a Statement
       *
       * @param statement
       * @param indentation
       * @returns
       */
      export function handleStatement(
        statement: Logic.Statement<Reason>,
        indentation: number,
      ): string {
        if (Logic.Statement.isValue(statement)) return handleValue(statement, indentation);
        return handleConnective(statement, indentation);
      }


      /**
       * Stringify a Value
       *
       * @param value
       * @param indentation
       * @returns
       */
      export function handleValue(
        value: Logic.Statement.Value<Reason>,
        indentation: number,
      ): string {
        return indent(indentation) + value.value;
      }


      /**
       * Stringify a Connective
       *
       * @param edge
       * @param indentation
       * @returns
       */
      export function handleConnective(
        edge: Logic.Statement.Connective<Reason>,
        indentation: number,
      ): string {
        if (Logic.Statement.Connective.isConjunction(edge)) return handleConjunction(edge, indentation);
        return handleDisjunction(edge, indentation);
      }


      /**
       * Stringify a Conjunction
       *
       * @param conjunction
       * @param indentation
       * @returns
       */
      export function handleConjunction(
        conjunction: Logic.Statement.Connective.Conjunction<Reason>,
        indentation: number,
      ): string {
        switch (conjunction.value.length) {
          case 0: return '';
          case 1: return handleStatement(conjunction.value[0]!, indentation);
          default: return indent(indentation)
            + 'must fulfill all of:'
            + '\n' + conjunction
            .value
            .map(subnode => handleStatement(subnode, indentation + 2))
            .join('\n');
        }
      }


      /**
       * Stringify a Disjunction
       *
       * @param disjunction
       * @param indentation
       * @returns
       */
      export function handleDisjunction(
        disjunction: Logic.Statement.Connective.Disjunction<Reason>,
        indentation: number,
      ): string {
        switch (disjunction.value.length) {
          case 0: return '';
          case 1: return handleStatement(disjunction.value[0]!, indentation);
          default: return indent(indentation)
            + 'must fulfill at-least one of:'
            + '\n' + disjunction
            .value
            .map(subnode => handleStatement(subnode, indentation + 2))
            .join('\n');
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
        return `Resolved ${stringify(original)} to ${toString}`;
      }

      /**
       * Safely stringify unknown type for notifying consumers
       *
       * @param unk
       * @returns
       */
      export function stringify(unk: unknown): string {
        switch (typeof unk) {
          case 'bigint': return `"${unk.toString()}" (typeof ${typeof unk})`;
          case 'boolean': return `"${unk.toString()}" (typeof ${typeof unk})`;
          case 'function': return `"[Function: ${unk.name}]" (typeof ${typeof unk})`;
          case 'number': return `"${unk.toString()}" (typeof ${typeof unk})`;
          case 'object': {
            if (unk === null) {
              return `"null" (typeof ${typeof unk})`;
            }
            // constructor may be undefined for objects inheriting null
            return `"[Object: ${unk.constructor?.name}]" (typeof ${typeof unk})`;
          }
          case 'string': return `"${unk.toString()}" (typeof ${typeof unk})`;
          case 'symbol': return `"${unk.toString()}" (typeof ${typeof unk})`;
          case 'undefined': return `"undefined" (typeof ${typeof unk})`;
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
      export function stringifyingError(unk: unknown, err: any) {
        console.error(`ERROR @nkp/config errored stringifying object of type ${typeof unk}`);
        return `___ ERRORED ${err?.name} ${err?.message} ___`;
      }
    }
  }
}