import { isDefined } from './utils';

/**
 * Simple logic trees with support for connectives
 */
export namespace Logic {
  /** Statement Type */
  export type Statement<V> =
    | Statement.Connective<V>
    | Statement.Value<V>;

  /** Statement Namespace */
  export namespace Statement {
    /** Base Statement type */
    export interface Base<V, T extends Statement.Type> { type: T; value: V; }
    /** type discriminators */
    export enum Type { Connective = 'Connective', Value = 'Value', }
    /** Claim Supertype of Statement */
    export interface Value<V> extends Statement.Base<V, Statement.Type.Value> {}
    /** Connective Supertype of Statement */
    export type Connective<V> =
      | Connective.Conjunction<V>
      | Connective.Disjunction<V>;

    /**
     * Create a Value type of Statement
     *
     * @param value
     * @returns
     */
    export function value<V>(value: V): Statement.Value<V> {
      return { type: Type.Value, value, };
    }

    /**
     * Is the Statement of Value type?
     *
     * @param statement
     * @returns
     */
    export function isValue<V>(statement: Statement<V>): statement is Statement.Value<V> {
      return statement.type === Type.Value;
    }

    /**
     * Is the Statement of Connective type?
     *
     * @param statement
     * @returns
     */
    export function isConnective<V>(statement: Statement<V>): statement is Statement.Connective<V> {
      return statement.type === Type.Connective;
    }

    /** Connective Namespace */
    export namespace Connective {
      /** Base Conective type */
      export interface Base<V, C extends Connective.Type> extends Statement.Base<Statement<V>[], Statement.Type.Connective> { connective: C; }
      /** type discriminators */
      export enum Type { Conjunction = 'Conjunction', Disjunction = 'Disjunction', }
      /** Conjunction supertype of Connective */
      export interface Conjunction<V> extends Base<V, Connective.Type.Conjunction> {}
      /** Disjunction supertype of Connective */
      export interface Disjunction<V> extends Base<V, Connective.Type.Disjunction> {}

      /**
       * {@link isConnective}
       */
      export const is = isConnective;

      /**
       * Is the Connective of Conjunction type?
       *
       * @param connective
       * @returns
       */
      export function isConjunction<V>(connective: Connective<V>): connective is Connective.Conjunction<V> {
        return connective.connective === Connective.Type.Conjunction;
      }

      /**
       * IS the connective of Disjunction type?
       *
       * @param connective
       * @returns
       */
      export function isDisjunction<V>(connective: Connective<V>): connective is Disjunction<V> {
        return connective.connective === Connective.Type.Disjunction;
      }

      /**
       * Create a Conjunction type of Connective
       *
       * @returns
       */
      export function conjunction<V>(children: Statement<V>[] = []): Conjunction<V> {
        return {
          type: Statement.Type.Connective,
          connective: Connective.Type.Conjunction,
          value: children,
        };
      }

      /**
       * Create a Disjunction type of Connective
       *
       * @returns
       */
      export function disjunction<V>(children: Statement<V>[] = []): Disjunction<V> {
        return {
          type: Statement.Type.Connective,
          connective: Connective.Type.Disjunction,
          value: children,
        };
      }
    }

    /**
     * Condense a statement to its minimal logically equivalent representation
     *
     * Collapses connectives
     *
     * @param statement
     * @param compare
     * @returns
     */
    export function condense<T>(statement: Statement<T>, compare: condense.Compare<T>): Statement<T> {
      const condensed = condense.handleStatement(statement, compare) as Statement<T>;
      return condensed;
    }


    export namespace condense {
      export interface Id<T> { id(id: T): unknown; eq?: undefined; }
      export interface Eq<T> { id?: undefined; eq(left: T, right: T): boolean; }
      export type Compare<T> = Id<T> | Eq<T>;

      /**
       * Condense a Statement
       *
       * @param statement
       * @param compare
       * @returns
       */
      export function handleStatement<T>(
        statement: Statement<T>,
        compare: Compare<T>
      ): Statement<T> | null {
        if (Statement.isValue(statement)) return handleValue(statement);
        return handleConnective(statement, compare);
      }


      /**
       * Condense a Value type of Statement
       *
       * @param node
       * @returns
       */
      export function handleValue<T>(node: Statement.Value<T>): Logic.Statement<T> {
        return node;
      }


      /**
       * Condense a Connective type of Statement
       *
       * @param node
       * @param compare
       * @returns
       */
      export function handleConnective<T>(
        node: Statement.Connective<T>,
        compare: Compare<T>,
      ): null | Logic.Statement<T> {
        if (Statement.Connective.isConjunction(node)) return handleConjunction(node, compare);
        return handleDisjunction(node, compare);
      }


      /**
       * Condense a Conjunction type of Connective
       *
       * @param conjunction
       * @param compare
       * @returns
       */
      export function handleConjunction<T>(
        conjunction: Statement.Connective.Conjunction<T>,
        compare: Compare<T>
      ): null | Logic.Statement<T> {
        const condensed = condenseConnective(conjunction, compare);
        // more-than-0 collapsed
        if (Array.isArray(condensed)) return Statement.Connective.conjunction(condensed);
        // 1 or 0 results
        return condensed;
      }


      /**
       * Condense a Disjunction type of Connective
       *
       * @param disjunction
       * @returns
       */
      export function handleDisjunction<T>(
        disjunction: Statement.Connective.Disjunction<T>,
        compare: Compare<T>
      ): null | Logic.Statement<T> {
        const condensed = condenseConnective(disjunction, compare);
        // more-than-0 collapsed
        if (Array.isArray(condensed)) return Statement.Connective.disjunction(condensed);
        // 1 or 0 results
        return condensed;
      }


      /**
       * Condense a Connective
       *
       * @param connective
       * @param compare
       * @returns
       */
      export function condenseConnective<T>(
        connective: Statement.Connective<T>,
        compare: Compare<T>,
      ): null | Logic.Statement<T> | Logic.Statement<T>[] {
        // eslint-disable-next-line prefer-const
        let condensed = connective.value;
        let changed = true;
        do {
          /**
           * condense children until there are no node type changes
           *
           * we need to iteratively perform this because
           * if we condense a child group and it transforms from an array of failures
           * to a single failure, then it transforms group an edge into a leaf
           * and the new leaf needs to be compared to other sibling leaves for
           * uniqueness
           */
          // trim duplicate leaves
          const deduplicated: Logic.Statement<T>[] = unique(connective.value, compare);
          const typesBefore = deduplicated.map((child) => child.type);
          const condensedNullable = deduplicated.map((statement) => handleStatement(statement, compare));
          const typesAfter = condensed.map((child) => child?.type);

          // did any nodes change type from edge to leaf?
          // (the only changes possible are to leaf or to null)
          changed = typesBefore.some((_, i) => typesAfter[i] != null && (typesBefore[i] !== typesAfter[i]));

          // clear fully collapsed nodes
          condensed = condensedNullable.filter(isDefined);
        } while (changed);

        // collapse to nothing
        if (condensed.length === 0) return null;

        // collapse to only contents
        if (condensed.length === 1) return condensed[0]!;

        return condensed;
      }


      /**
       * Filter in only unique failure reasons
       *
       * @param failures
       * @param compare
       * @returns
       */
      export function unique<T>(
        failures: Logic.Statement<T>[],
        compare: Compare<T>
      ): Logic.Statement<T>[] {
        if (compare.id) {
          // compare & keep only unique values
          // use id method
          const values = new Set<unknown>();

          const filtered = failures.filter(child => {
            // only filter out leaves
            if (!Statement.isValue(child)) return true;
            // keep only unique reasons
            const value = compare.id(child.value);
            if (values.has(value)) return false;
            values.add(value);
            return true;
          });

          return filtered;
        }

        else {
          // compare & keep only unique values
          // use eq method
          const seens: T[] = [];

          const filtered = failures.filter(child => {
            // only filter out leaves
            if (!Statement.isValue(child)) return true;
            // keep only unique reasons
            const value = child.value;
            // already seen
            if (seens.some((seen) => compare.eq(value, seen))) return false;
            // noy yet seen
            seens.push(value);
            return true;
          });

          return filtered;
        }

      }
    }
  }
}
