import { ParseResult, ParseSuccess, ParseFail } from '../ts/parse-result';
import { Type } from './type';

/**
 * Parses as one of many possible types
 */
export class OneOfType<T> extends Type<T> {
  constructor(
    protected readonly oneOf: readonly T[],
    otherwise?: T) {
    super(otherwise);
  }

  /** @inheritdoc */
  parse(unk: unknown): ParseResult<T> {
    const isSome = this.oneOf.some(one => one === unk);
    if (isSome) return new ParseSuccess(unk as T);
    return new ParseFail(`is not one of "${this.oneOf.join('", "')}"`);
  }
}
