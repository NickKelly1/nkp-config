import { TypeOptions, Type } from './circular-dependencies';
import { Parse } from './parse';
import { ParseInfo } from './ts';

export interface BooleanOptions extends TypeOptions<boolean> {}

/**
 * Represents a parseable boolean
 */
export class BooleanType extends Type<boolean> {
  constructor(public override readonly options?: BooleanOptions) {
    super();
  }

  /** @inheritdoc */
  handle(unk: unknown, info: ParseInfo): Parse.Output<boolean> {
    const { isSet, } = info;

    // must be set
    if (!isSet) return Parse.Fail.isNotSet;

    switch (typeof unk) {
      case 'boolean': return Parse.success(unk);
      case 'string': {
        const lc = unk.toLowerCase().trim();
        if (lc === 'true') return Parse.success(true);
        if (lc === 'false') return Parse.success(false);
        if (lc === '1') return Parse.success(true);
        if (lc === '0') return Parse.success(false);
        return Parse.fail('Must be a boolean.');
      }
      case 'number': {
        if (unk === 0) return Parse.success(false);
        if (unk === 1) return Parse.success(true);
        return Parse.fail('Must be a boolean.');
      }
      case 'bigint': {
        if (unk === BigInt(0)) return Parse.success(false);
        if (unk === BigInt(1)) return Parse.success(true);
        return Parse.fail('Must be a boolean.');
      }
      default: return Parse.fail('Must be a boolean.');
    }
  }
}

/**
 * Parse as a boolean
 *
 * @param key
 * @param otherwise
 * @returns
 */
export function boolean(options?: BooleanOptions): BooleanType {
  return new BooleanType(options);
}
