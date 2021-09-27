import {
  boolean,
  BooleanOptions,
  BooleanType,
  float,
  FloatOptions,
  FloatType,
  integer,
  IntegerOptions,
  IntegerType,
  literal,
  LiteralOptions,
  LiteralType,
  oneOf,
  OneOfOptions,
  OneOfType,
  string,
  StringOptions,
  StringType,
  Type,
  UnionType
} from './circular-dependencies';
import { Typeable } from './constants';
import { Fromable, normaliseFromable, ParseFail, ParseResult, ParseSuccess } from './ts';
import { hasOwn } from './utils';

/**
 * Tuple of Key and Type
 *
 * Key is of an object being parsed
 * Type is the parser for the keys value
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class TypeKey<TA extends Type = Type> {
  /**
   * Create a readable reason that a parse failed
   *
   * @param key
   * @param valueReason
   * @returns
   */
  public static toReason(key: PropertyKey, valueReason: string): string {
    return `${String(key)}: ${valueReason}`;
  }

  /**
   * Is the value a TypeKey?
   *
   * @param value
   * @returns
   */
  public static is(value: unknown): value is TypeKey {
    if (!value) return false;
    if ((value as any).kind === Typeable.TypeKey) return true;
    return false;
  }

  constructor(
    public readonly key: string,
    public readonly type: TA
  ) {
    //
  }

  public get kind(): Typeable.TypeKey { return Typeable.TypeKey; }

  /**
   * Set the default value if the value is not given
   */
  default(value: TA['_v']): TypeKey<UnionType<TA, LiteralType<TA['_v']>>> {
    return new TypeKey(this.key, this.type.default(value));
  }

  /**
   * Set the default value if the value is not given
   */
  optional(): TypeKey<UnionType<TA, LiteralType<undefined>>> {
    return new TypeKey(this.key, this.type.optional());
  }

  /**
   * Union this type with another type
   */
  public get or(): TypeKeyOr<TA> {
    return new TypeKeyOr(this);
  }

  /**
   * Parse as this TypeKey's type OR another type
   *
   * @param type
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public union<TB extends Type>(orType: TB): TypeKey<UnionType<TA, TB>> {
    return new TypeKey(this.key, this.type.union(orType));
  }

  /**
   * Parse the key's value
   *
   * @param from
   * @returns
   */
  public parse(from: Fromable = (typeof process !== 'undefined' && process && process?.env) || {}): TA['_v'] {
    const tried = this.tryParse(from);
    if (!tried.isSuccessful) throw new TypeError(`Failed to parse type-key: ${tried.reason}`);
    return tried.value;
  }

  /**
   * Try to parse the key's value on an object
   *
   * @param from
   * @returns
   */
  tryParse(from: Fromable = (typeof process !== 'undefined' && process && process?.env) || {}): ParseResult<TA['_v']> {
    const normalized = normaliseFromable(from);
    const isSet = hasOwn(normalized, this.key);
    const value = normalized[this.key];
    if (this.type.handles(value, { isSet, })) {
      const result = this.type.tryParse(value, { isSet, });
      if (!result.isSuccessful) {
        return new ParseFail(TypeKey.toReason(this.key, result.reason));
      }
      return new ParseSuccess(result.value);
    }
    if (isSet) {
      return new ParseFail(TypeKey.toReason(this.key, 'value is set'));
    }
    return new ParseFail(TypeKey.toReason(this.key, 'value is not set'));
  }
}

export class TypeKeyOr<TA extends Type = Type> {
  constructor(protected readonly root: TypeKey<TA>) {}

  /**
   * Union this type with a Literal type
   *
   * @param options
   * @returns
   */
  literal<T>(value: T, options?: LiteralOptions<T>): TypeKey<UnionType<TA, LiteralType<T>>> {
    return this.root.union(literal(value, options));
  }

  /**
   * Union this type with a Boolean type
   *
   * @param options
   * @returns
   */
  boolean(options?: BooleanOptions): TypeKey<UnionType<TA, BooleanType>> {
    return this.root.union(boolean(options));
  }

  /**
   * Union this type with a Float type
   *
   * @param options
   * @returns
   */
  float(options?: FloatOptions): TypeKey<UnionType<TA, FloatType>> {
    return this.root.union(float(options));
  }

  /**
   * Union this type with an Integer type
   *
   * @param options
   * @returns
   */
  integer(options?: IntegerOptions): TypeKey<UnionType<TA, IntegerType>> {
    return this.root.union(integer(options));
  }

  /**
   * Union this type with a String type
   *
   * @param options
   * @returns
   */
  string(options?: StringOptions): TypeKey<UnionType<TA, StringType>> {
    return this.root.union(string(options));
  }

  /**
   * Union this type with a oneOf type
   *
   * @param values
   * @param options
   * @returns
   */
  oneOf<T>(values: readonly T[], options?: OneOfOptions<T>): TypeKey<UnionType<TA, OneOfType<T>>> {
    return this.root.union(oneOf(values, options));
  }
}
