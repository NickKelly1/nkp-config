import { TypeOptions, Type } from './circular-dependencies';
import { Parse } from './parse';
import { ParseInfo } from './ts';

export interface LiteralOptions<T> extends TypeOptions<T> {
  //
}

/**
 * Represents a default string if the value was not set
 */
export class LiteralType<T> extends Type<T> {
  constructor(
    protected readonly value: T,
    public override readonly options?: LiteralOptions<T>,
  ) {
    super();
  }

  /** @inheritdoc */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(unk: unknown, info: ParseInfo): Parse.Output<T> {
    const { isSet } = info

    if (isSet) return Parse.fail('Cannot provide literal when a value is already set.');

    return Parse.success(this.value);
  }
}

/**
 * Set as the default value if not defined
 *
 * @param key
 * @param otherwise
 * @returns
 */
export function literal<T>(value: T, options?: LiteralOptions<T>): LiteralType<T> {
  return new LiteralType(value, options);
}
