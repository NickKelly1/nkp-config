import { ParseResult, ParseSuccess, ParseFail, UnionValue, UnionOptions } from '../ts';
import { Type } from '.';

/**
 * Type t or type u
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class UnionType<TA extends Type, TB extends Type> extends Type<UnionValue<TA, TB>, UnionOptions<TA, TB>> {
  constructor(
    public readonly ta: TA,
    public readonly tb: TB,
  ) {
    super(ta.otherwise !== undefined
      ? ta.otherwise : tb.otherwise === undefined
        ? tb.otherwise : undefined);
  }

  parse(unk: unknown): ParseResult<UnionValue<TA, TB>> {
    const tParse = this.ta.parse(unk);
    if (tParse instanceof ParseSuccess) return tParse;
    const uParse = this.tb.parse(unk);
    if (uParse instanceof ParseSuccess) return uParse;
    return new ParseFail(`${tParse} and ${uParse}`);
  }
}
