import { TypeOptions, Type } from './circular-dependencies';
import { ParseResult, ParseSuccess, ParseFail } from './ts';

export interface StringOptions extends TypeOptions<string> {}

/**
 * Represents a parseable string
 */
export class StringType extends Type<string> {
  constructor(protected override readonly options?: StringOptions) {
    super();
  }

  /** @inheritdoc */
  tryParse(unk: unknown): ParseResult<string> {
    switch (typeof unk) {
    case 'string': return new ParseSuccess(unk);
    case 'number':
    case 'boolean':
    case 'bigint':
      return new ParseSuccess(String(unk));
    default:
      return new ParseFail('is not string-like');
    }
  }
}

/**
 * Parse as a string
 *
 * @param key
 * @param otherwise
 * @returns
 */
export function string(options?: StringOptions): StringType {
  return new StringType(options);
}
