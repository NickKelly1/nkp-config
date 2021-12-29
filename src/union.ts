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

    const tReason: Parse.Fail = tResult.value;
    const bReason: Parse.Fail = UReason.value;
    const reasons = Parse.Fail.any();
    Parse.Fail.add(reasons, tReason);
    Parse.Fail.add(reasons, bReason);
    return Parse.fail(reasons);
  }
}
