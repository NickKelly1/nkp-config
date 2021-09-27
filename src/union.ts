import { ParseResult, ParseFail, ParseValueOptions } from './ts';
import { Type } from './type';
import { getIsSet } from './utils';

/**
 * Type t or type u
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class UnionType<TA extends Type, TB extends Type> extends Type<TA['_v'] | TB['_v']> {
  constructor(
    public readonly ta: TA,
    public readonly tb: TB,
  ) {
    super();
  }

  override get handlesUnset(): boolean {
    return this.ta.handlesUnset || this.tb.handlesUnset;
  }

  override get handlesSet(): boolean {
    return this.ta.handlesSet || this.tb.handlesSet;
  }

  /**
   * Try to parse
   *
   * @param unk
   * @param options
   * @returns
   */
  tryParse(unk: unknown, options?: ParseValueOptions): ParseResult<TA['_v'] | TB['_v']> {
    const isSet = getIsSet(options);

    let parseAReason: undefined | string;
    if ((isSet && this.ta.handlesSet) || (!isSet && this.ta.handlesUnset)) {
      const parse = this.ta.tryParse(unk);
      if (parse.isSuccessful) return parse;
      parseAReason = parse.reason;
    }

    let parseBReason: undefined | string;
    if ((isSet && this.tb.handlesSet) || (!isSet && this.tb.handlesUnset)) {
      const parse = this.tb.tryParse(unk);
      if (parse.isSuccessful) return parse;
      parseBReason = parse.reason;
    }

    if (parseAReason !== undefined && parseBReason !== undefined) {
      // both parsed
      return new ParseFail(`${parseAReason} and ${parseBReason}`);
    }

    if (parseAReason !== undefined) {
      // only A parsed
      return new ParseFail(parseAReason);
    }

    if (parseBReason !== undefined) {
      // only B parsed
      return new ParseFail(parseBReason);
    }

    if (isSet) {
      // neither parsed and is set
      return new ParseFail('value is set');
    }

    // not set
    return new ParseFail('value is not set');
  }
}
