import { TypeOptions, Type } from './circular-dependencies';
import { ParseResult, ParseFail, ParseSuccess } from './ts';

export interface FloatOptions extends TypeOptions<number> {}

/**
 * Represents a parseable float
 */
export class FloatType extends Type<number> {
  constructor(protected override readonly options?: FloatOptions) {
    super();
  }

  /** @inheritdoc */
  tryParse(unk: unknown): ParseResult<number> {
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

/**
 * Parse as a float
 *
 * @param key
 * @param otherwise
 * @returns
 */
export function float(options?: FloatOptions): FloatType {
  return new FloatType(options);
}
