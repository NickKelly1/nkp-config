import { ParseResult, ParseFail, ParseSuccess } from '../ts';
import { Type } from '.';

/**
 * Represents a parseable boolean
 */
export class BooleanType extends Type<boolean> {
  /** @inheritdoc */
  parse(unk: unknown): ParseResult<boolean> {
    switch (typeof unk) {
    case 'boolean': return new ParseSuccess(unk);
    case 'string': {
      const lc = unk.toLowerCase().trim();
      if (lc === 'true') return new ParseSuccess(true);
      if (lc === 'false') return new ParseSuccess(false);
      if (lc === '1') return new ParseSuccess(true);
      if (lc === '0') return new ParseSuccess(false);
      return new ParseFail('is not a boolean');
    }
    case 'number': {
      if (unk === 0) return new ParseSuccess(false);
      if (unk === 1) return new ParseSuccess(true);
      return new ParseFail('is not a boolean');
    }
    case 'bigint': {
      if (unk === BigInt(0)) return new ParseSuccess(false);
      if (unk === BigInt(1)) return new ParseSuccess(true);
      return new ParseFail('is not a boolean');
    }
    default: return new ParseFail('is not a boolean');
    }
  }
}
