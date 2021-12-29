import { TypeOptions, Type } from './circular-dependencies';
import { Parse } from './parse';
import { ParseInfo } from './ts';

export interface OneOfOptions<T> extends TypeOptions<T> {}

/**
 * Parses as one of many possible types
 */
export class OneOfType<T> extends Type<T> {
  constructor(
    protected readonly oneOf: readonly T[],
    public override readonly options?: OneOfOptions<T>,
  ) {
    super();
  }

  /** @inheritdoc */
  handle(unk: unknown, info: ParseInfo): Parse.Output<T> {
    const { isSet, } = info;

    // must be set
    if (!isSet) return Parse.Fail.isNotSet;

    const isSome = this.oneOf.some(one => one === unk);
    if (isSome) return Parse.success(unk as T);
    return Parse.fail(`Must be onw of "${this.oneOf.join('", "')}"`);
  }
}

/**
 * Parse as a one of a given set of values
 *
 * @param key
 * @param otherwise
 * @returns
 */
export function oneOf<T>(
  values: readonly T[],
  options?: OneOfOptions<T>,
): OneOfType<T> {
  return new OneOfType(values, options);
}
