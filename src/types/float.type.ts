import { ParseResult, ParseFail, ParseSuccess } from '../ts/parse-result';
import { Type } from './type';

/**
 * Represents a parseable float
 */
export class FloatType extends Type<number> {
  /** @inheritdoc */
  parse(unk: unknown): ParseResult<number> {
    switch (typeof unk) {
    case 'number': {
      if (!Number.isFinite(unk)) return new ParseFail('is not finite');
      return new ParseSuccess(unk);
    }
    case 'bigint': {
      const num = Number(unk);
      if (!Number.isFinite(num)) return new ParseFail('is too large');
      if (!(num.toString() === unk.toString())) return new ParseFail('is too large');
      return new ParseSuccess(num);
    }
    case 'string': {
      const int = Number(unk);
      if (!Number.isFinite(int)) return new ParseFail('is not an integer');
      return new ParseSuccess(int);
    }
    default: return new ParseFail('is not an integer');
    }
  }
}
