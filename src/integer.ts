import { TypeOptions, Type } from './circular-dependencies';
import { Failure } from './failure';
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
    const { isSet } = info;

    // must be set
    if (!isSet) return Parse.fail(Failure.isNotSet);

    switch (typeof unk) {
    // parse string
    case 'string': {
      const int = Number(unk);
      if (!Number.isFinite(int)) {
        // must be a finite number
        const reason = Failure.message('Must be an integer', unk, int);
        return Parse.fail(reason);
      }

      if (Math.floor(int) !== int) {
        // not an integer
        const reason = Failure.message('Must be an integer', unk, int);
        return Parse.fail(reason);
      }

      // maybe success
      return this._validateBounds(int);
    }

    // parse number
    case 'number': {
      if (unk !== Math.floor(unk)) {
        const reason = Failure.message('Must be an integer', unk, unk);
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
        const reason = Failure.message('Must be an integer', unk, int);
        return Parse.fail(reason);
      }

      if (int !== Number(unk)) {
        // too large
        const reason = Failure.message('Must be an integer (is too large)', unk, int);
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

    const reasons = Failure.all();

    // TODO: testing
    if (eq != null && !(int === eq)) {
      Failure.add(reasons, Failure.create(`Must be an integer eq ${eq}.`));
    }

    if (gt != null && !(int > gt)) {
      Failure.add(reasons, Failure.create(`Must be an integer gt ${gt}.`));
    }

    if (gte != null && !(int >= gte)) {
      Failure.add(reasons, Failure.create(`Must be an integer gte ${gte}.`));
    }

    if (lt != null && !(int < lt)) {
      Failure.add(reasons, Failure.create(`Must be an integer lt ${lt}.`));
    }

    if (lte != null && !(int <= lte)) {
      Failure.add(reasons, Failure.create(`Must be an integer lte ${lte}.`));
    }

    if (!Failure.empty(reasons)) {
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
