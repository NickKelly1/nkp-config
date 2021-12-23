import { Failure } from './failure';
import { Parse } from './parse';
import { ParseInfo } from './ts';
import { Type } from './type';

/**
 * Type t or type u
 */

export class UnionType<T, U> extends Type<T | U> {
  constructor(
    public readonly tt: Type<T>,
    public readonly tu: Type<U>,
  ) {
    super();
  }

  /** @inheritdoc */
  handle(unk: unknown, info: ParseInfo): Parse.Output<T | U> {
    const tResult = this.tt.tryParse(unk, info);
    if (Parse.isSuccess(tResult)) return tResult;

    const UReason = this.tu.tryParse(unk, info);
    if (Parse.isSuccess(UReason)) return UReason;

    const tReason = tResult.value;
    const bReason = UReason.value;
    const reasons = Failure.any();
    reasons.value.push(tReason);
    reasons.value.push(bReason);
    return Parse.fail(reasons);
  }
}
