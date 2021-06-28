import { ParseResult, ParseFail, ParseSuccess } from '../ts';
import { Type } from '.';

/**
 * Represents a parseable string
 */
export class StringType extends Type<string> {
  /** @inheritdoc */
  parse(unk: unknown): ParseResult<string> {
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
