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
  TypeKey,
  UnionType
} from './circular-dependencies';
import { Typeable } from './constants';
import { Parse } from './parse';
import { Failure } from './failure';
import { IsSetOptions, ParseInfo } from './ts';

export interface TypeOptions<T> extends IsSetOptions {
  //
}

/**
 * Represents a parseable type
 */
export abstract class Type<T = any> {
  /** virtal property for type inference */
  public get _v(): T { throw new Error('Inaccessable property "_v"'); }

  public get kind(): Typeable.Type { return Typeable.Type; }

  public readonly options?: TypeOptions<T>;

  /**
   * Is the value a Type instance?
   *
   * @param value     value to check
   * @returns         whether value is an instance of this TypeClass?
   */
  public static is(value: unknown): value is Type {
    if (!value) return false;
    if ((value as any).kind === Typeable.Type) return true;
    return false;
  }

  /**
   * Try to parse the value
   *
   * @param unk
   * @param opts
   */
  protected abstract handle(unk: unknown, info: ParseInfo): Parse.Output<T>;

  /**
   * Try to parse the value
   *
   * @param unk
   * @param opts
   */
  public tryParse(unk: unknown, info?: Partial<ParseInfo>): Parse.Output<T> {
    const _info: ParseInfo = {
      isSet: info?.isSet ?? true,
    };

    const output = this.handle(unk, _info);

    return output;
  }

  /**
   * Parse the value
   *
   * @param from
   * @returns
   */
  public parse(from: unknown, info?: Partial<ParseInfo>): T {
    const _info: ParseInfo = {
      isSet: info?.isSet ?? true,
    };

    const output = this.handle(from, _info);

      // fail
    if (Parse.isFail(output)) {
      // throw
      const msg = 'Failed to parse value: '
        + ' ' + Failure.stringify(output.value);
      throw new TypeError(`Failed to parse type: `);
    }

    // success
    return output.value;
  }

  /**
   * Key and type
   *
   * @param key
   * @returns
   */
  key(key: string): TypeKey<T> {
    return new TypeKey(key, this);
  }

  /**
   * Union this type with another type
   */
  get or(): TypeOr<T> {
    return new TypeOr(this);
  }

  /**
   * Set the default value if the value is not given
   */
  default(value: T): Type<T> {
    return this.or.literal(value);
  }

  /**
   * Set the default value if the value is not given
   */
  defaultW<U>(value: U): Type<T | U> {
    return this.or.literal(value);
  }

  /**
   * Set the default value, if the value is not given, to undefined
   *
   * @returns
   */
  optional(): Type<T | undefined> {
    return this.or.literal(undefined);
  }

  /**
   * Parse as this type OR another type
   *
   * @param type
   * @returns
   */
  public union<U>(type: Type<U>): Type<T | U> {
    const t = new UnionType(this, type);
    return t;
  }
}

export class TypeOr<U = any> {
  constructor(protected readonly root: Type<U>) {}


  /**
   * Union this type with a Literal type
   *
   * @param options
   * @returns
   */
  literal<T>(value: T, options?: LiteralOptions<T>): Type<U | T> {
    return this.root.union(literal(value, options));
  }


  /**
   * Union of this type with a Boolean type
   *
   * @param options
   * @returns
   */
  boolean(options?: BooleanOptions): Type<U | boolean> {
    return this.root.union(boolean(options));
  }

  /**
   * Union of this type with a Float type
   *
   * @param options
   * @returns
   */
  float(options?: FloatOptions): Type<U | number> {
    return this.root.union(float(options));
  }

  /**
   * Union of this type with an Integer type
   *
   * @param options
   * @returns
   */
  integer(options?: IntegerOptions): Type<U | number> {
    return this.root.union(integer(options));
  }

  /**
   * Union of this type with a String type
   *
   * @param options
   * @returns
   */
  string(options?: StringOptions): Type<U | string> {
    return this.root.union(string(options));
  }

  /**
   * Union of this type with a oneOf type
   *
   * @param values
   * @param options
   * @returns
   */
  oneOf<T>(values: readonly T[], options?: OneOfOptions<T>): Type<U | T> {
    return this.root.union(oneOf(values, options));
  }
}
