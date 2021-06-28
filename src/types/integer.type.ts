import { ParseResult, ParseFail, ParseSuccess } from '../ts/parse-result';
import { Type } from './type';

/**
 * Represents a parseable integer
 */
export class IntegerType extends Type<number> {
  /** @inheritdoc */
  parse(unk: unknown): ParseResult<number> {
    switch (typeof unk) {
    case 'string': {
      const int = Number(unk);
      if (!Number.isFinite(int)) return new ParseFail('is not an integer');
      if (Math.floor(int) !== int) return new ParseFail('is not an integer');
      return new ParseSuccess(int);
    }
    case 'number': {
      if (unk !== Math.floor(unk)) return new ParseFail('is not an integer');
      return new ParseSuccess(unk);
    }
    case 'bigint': {
      const int = Number(unk);
      if (!Number.isFinite(int)) return new ParseFail('is too large');
      if (int !== Number(unk)) return new ParseFail('is too large');
      return new ParseSuccess(int);
    }
    default: return new ParseFail('is not an integer');
    }
  }
}
