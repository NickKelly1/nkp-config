import { TypeOptions, Type } from './circular-dependencies';
import { ParseResult, ParseSuccess, ParseFail } from './ts';

export interface OneOfOptions<T> extends TypeOptions<T> {}

/**
 * Parses as one of many possible types
 */
export class OneOfType<T> extends Type<T> {
  constructor(
    protected readonly oneOf: readonly T[],
    protected override readonly options?: OneOfOptions<T>,
  ) {
    super();
  }

  /** @inheritdoc */
  tryParse(unk: unknown): ParseResult<T> {
    const isSome = this.oneOf.some(one => one === unk);
    if (isSome) return new ParseSuccess(unk as T);
    return new ParseFail(`is not one of "${this.oneOf.join('", "')}"`);
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
