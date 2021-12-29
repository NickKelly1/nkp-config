import {
  boolean,
  BooleanOptions,
  float,
  FloatOptions,
  integer,
  IntegerOptions,
  literal,
  LiteralOptions,
  oneOf,
  OneOfOptions,
  string,
  StringOptions,
  Type
} from './circular-dependencies';
import { Typeable } from './constants';
import { Parse } from './parse';
import {
  Fromable,
  ParseInfo
} from './ts';
import {
  defaultFromable,
  isPropertySet,
  normaliseFromable
} from './utils';

/**
 * Tuple of Key and Type
 *
 * Key is of an object being parsed
 * Type is the parser for the keys value
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class TypeKey<T = any> {
  /** virtal property for type inference */
  public get _v(): T { throw new Error('Inaccessable property "_v"'); }

  /**
   * Create a readable reason that a parse failed
   *
   * @param key
   * @param reasons
   * @returns
   */
  public static toFailureReason(key: PropertyKey, reasons: Parse.Fail): string {
    return `"${String(key)}": ${Parse.Fail.stringify(reasons)}`;
  }

  /**
   * Is the value a TypeKey instance?
   *
   * @param value
   * @returns
   */
  public static is(value: unknown): value is TypeKey {
    if (!value) return false;
    if ((value as any).kind === Typeable.TypeKey) return true;
    return false;
  }

  /**
   * TypeKey constructor
   *
   * @param key       key of the host object
   * @param type      expected type of the key's value
   */
  constructor(
    public readonly key: string,
    public readonly type: Type<T>
  ) {
    //
  }

  public get kind(): Typeable.TypeKey { return Typeable.TypeKey; }

  /**
   * Set the default value if the value is not given
   */
  default(value: T): TypeKey<T> {
    return new TypeKey(this.key, this.type.default(value));
  }


  /**
   * Set the default value if the value is not given
   */
  defaultW<U>(value: U): TypeKey<this['_v'] | U> {
    return this.or.literal(value);
  }

  /**
   * Set the default value if the value is not given
   */
  optional(): TypeKey<T | undefined> {
    return new TypeKey(this.key, this.type.optional());
  }

  /**
   * Union this type with another type
   */
  public get or(): TypeKeyOr<T> {
    return new TypeKeyOr(this);
  }

  /**
   * Parse as this TypeKey's type OR another type
   *
   * @param type
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public union<U>(orType: Type<U>): TypeKey<T | U> {
    return new TypeKey(this.key, this.type.union(orType));
  }

  /**
   * Parse the key's value
   *
   * @param from
   * @returns
   */
  public parse(from: Fromable = defaultFromable()): T {
    const output = this.tryParse(from);

    // fail
    if (Parse.isFail(output)) {
      // throw
      const msg = 'Invalid property value:'
        + ' ' + TypeKey.toFailureReason(this.key, output.value);
      throw new TypeError(msg);
    }

    // success
    return output.value;
  }

  /**
   * Try to parse the key's value on an object
   *
   * @param from
   * @returns
   */
  tryParse(from: Fromable = defaultFromable): Parse.Output<T> {
    const _from = normaliseFromable(from);
    const isSet = isPropertySet(_from, this.key);
    const value = _from[this.key];
    const info: ParseInfo = { isSet, };
    const output = this.type.tryParse(value, info);
    return output;
  }
}

export class TypeKeyOr<T = any> {
  constructor(protected readonly root: TypeKey<T>) {}

  /**
   * Union this type with a Literal type
   *
   * @param options
   * @returns
   */
  literal<U>(value: U, options?: LiteralOptions<U>): TypeKey<T | U> {
    return this.root.union(literal(value, options));
  }

  /**
   * Union this type with a Boolean type
   *
   * @param options
   * @returns
   */
  boolean(options?: BooleanOptions): TypeKey<T | boolean> {
    return this.root.union(boolean(options));
  }

  /**
   * Union this type with a Float type
   *
   * @param options
   * @returns
   */
  float(options?: FloatOptions): TypeKey<T | number> {
    return this.root.union(float(options));
  }

  /**
   * Union this type with an Integer type
   *
   * @param options
   * @returns
   */
  integer(options?: IntegerOptions): TypeKey<T | number> {
    return this.root.union(integer(options));
  }

  /**
   * Union this type with a String type
   *
   * @param options
   * @returns
   */
  string(options?: StringOptions): TypeKey<T | string> {
    return this.root.union(string(options));
  }

  /**
   * Union this type with a oneOf type
   *
   * @param values
   * @param options
   * @returns
   */
  oneOf<U>(values: readonly U[], options?: OneOfOptions<U>): TypeKey<T | U> {
    return this.root.union(oneOf(values, options));
  }
}
