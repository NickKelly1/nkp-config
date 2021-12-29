import { TypeOptions, Type } from './circular-dependencies';
import { Parse } from './parse';
import { ParseInfo } from './ts';

export interface IntegerOptions extends TypeOptions<number> {
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  eq?: number;
}

/**
 * Represents a parseable integer
 */
export class IntegerType extends Type<number> {
  constructor(public override readonly options?: IntegerOptions) {
    super();
  }


  /** @inheritdoc */
  handle(unk: unknown, info: ParseInfo): Parse.Output<number> {
    const { isSet, } = info;

    // must be set
    if (!isSet) return Parse.Fail.isNotSet;

    switch (typeof unk) {
    // parse string
      case 'string': {
        const int = Number(unk);
        if (!Number.isFinite(int)) {
          // must be a finite number
          const reason = Parse.Fail.message('Must be an integer', unk, int);
          return Parse.fail(reason);
        }

        if (Math.floor(int) !== int) {
          // not an integer
          const reason = Parse.Fail.message('Must be an integer', unk, int);
          return Parse.fail(reason);
        }

        // maybe success
        return this._validateBounds(int);
      }

      // parse number
      case 'number': {
        if (unk !== Math.floor(unk)) {
          const reason = Parse.Fail.message('Must be an integer', unk, unk);
          return Parse.fail(reason);
        }

        // maybe success
        return this._validateBounds(unk);
      }

      // parse bigint
      case 'bigint': {
        const int = Number(unk);

        if (!Number.isFinite(int)) {
          // too large
          const reason = Parse.Fail.message('Must be an integer', unk, int);
          return Parse.fail(reason);
        }

        if (int !== Number(unk)) {
          // too large
          const reason = Parse.Fail.message('Must be an integer (is too large)', unk, int);
          return Parse.fail(reason);
        }

        // maybe success
        return this._validateBounds(int);
      }

      // other
      default: {
        const reason = 'Must be an integer';
        return Parse.fail(reason);
      }
    }
  }


  /**
   * Parse the bounds
   *
   * @param int       parsed integer value
   * @returns         bound validation result
   */
  protected _validateBounds(int: number): Parse.Output<number> {
    const {
      eq,
      gt,
      gte,
      lt,
      lte,
    } = this.options ?? {};

    const reasons = Parse.Fail.all();

    // TODO: testing
    if (eq != null && !(int === eq)) {
      Parse.Fail.add(reasons, `Must be an integer eq ${eq}.`);
    }

    if (gt != null && !(int > gt)) {
      Parse.Fail.add(reasons, `Must be an integer gt ${gt}.`);
    }

    if (gte != null && !(int >= gte)) {
      Parse.Fail.add(reasons, `Must be an integer gte ${gte}.`);
    }

    if (lt != null && !(int < lt)) {
      Parse.Fail.add(reasons, `Must be an integer lt ${lt}.`);
    }

    if (lte != null && !(int <= lte)) {
      Parse.Fail.add(reasons, `Must be an integer lte ${lte}.`);
    }

    if (!Parse.Fail.isEmpty(reasons)) {
      return Parse.fail(reasons);
    }

    return Parse.success(int);
  }

}

/**
 * Parse as an integer
 *
 * @param key
 * @param otherwise
 * @returns
 */
export function integer(options?: IntegerOptions): IntegerType {
  return new IntegerType(options);
}
