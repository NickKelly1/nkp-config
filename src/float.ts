import { TypeOptions, Type } from './circular-dependencies';
import { Parse } from './parse';
import { ParseInfo } from './ts';

export interface FloatOptions extends TypeOptions<number> {
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  eq?: number;
}

/**
 * Represents a parseable float
 */
export class FloatType extends Type<number> {
  constructor(public override readonly options?: FloatOptions) {
    super();
  }


  /** @inheritdoc */
  handle(unk: unknown, info: ParseInfo): Parse.Output<number> {
    const { isSet, } = info;

    // must be set
    if (!isSet) return Parse.Fail.isNotSet;

    switch (typeof unk) {
      // parse number
      case 'number': {
        if (!Number.isFinite(unk)) {
          const reason = Parse.Fail.message('Must be a float', unk, unk);
          return Parse.fail(reason);
        }

        return this._validateBounds(unk);
      }

      // parse bigint
      case 'bigint': {
        const num = Number(unk);

        if (!Number.isFinite(num)) {
          // too big
          const reason = Parse.Fail.message('Must be a float', unk, num);
          return Parse.fail(reason);
        }

        if (!(num.toString() === unk.toString())) {
          // didn't resolve properly
          const reason = Parse.Fail.message('Must be a float (is too large)', unk, num);
          return Parse.fail(reason);
        }

        return this._validateBounds(num);
      }

      // parse string
      case 'string': {
        const num = Number(unk);
        if (!Number.isFinite(num)) {
        // not finite
          const reason = Parse.Fail.message('Must be a float', unk, num);
          return Parse.fail(reason);
        }

        return this._validateBounds(num);
      }

      // other
      default: {
        const reason = 'Must be a float';
        return Parse.fail(reason);
      }
    }
  }


  /**
   * Parse the bounds
   *
   * @param float       parsed float value
   * @returns         bound validation result
   */
  protected _validateBounds(float: number): Parse.Output<number> {
    const {
      eq,
      gt,
      gte,
      lt,
      lte,
    } = this.options ?? {};

    const reasons = Parse.Fail.all();

    // TODO: testing
    if (eq != null && !(float === eq)) {
      Parse.Fail.add(reasons, `Must be a float eq ${eq}.`);
    }

    if (gt != null && !(float > gt)) {
      Parse.Fail.add(reasons, `Must be a float gt ${gt}.`);
    }

    if (gte != null && !(float >= gte)) {
      Parse.Fail.add(reasons, `Must be a float gte ${gte}.`);
    }

    if (lt != null && !(float < lt)) {
      Parse.Fail.add(reasons, `Must be a float lt ${lt}.`);
    }

    if (lte != null && !(float <= lte)) {
      Parse.Fail.add(reasons, `Must be a float lte ${lte}.`);
    }

    if (!Parse.Fail.isEmpty(reasons)) {
      return Parse.fail(reasons);
    }

    return Parse.success(float);
  }

}

/**
 * Parse as a float
 *
 * @param key
 * @param otherwise
 * @returns
 */
export function float(options?: FloatOptions): FloatType {
  return new FloatType(options);
}
