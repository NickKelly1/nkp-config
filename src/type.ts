import {
  BooleanOptions,
  BooleanType,
  boolean,
  FloatOptions,
  FloatType,
  float,
  IntegerOptions,
  IntegerType,
  integer,
  LiteralOptions,
  literal,
  LiteralType,
  OneOfOptions,
  OneOfType,
  oneOf,
  StringOptions,
  StringType,
  string,
  UnionType,
  LiteralBehavior
} from './circular-dependencies';
import { Typeable } from './constants';
import { ParseResult, ParseValueOptions } from './ts';
import { getIsSet } from './utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TypeOptions<T> {}

/**
 * Represents a parseable type
 */
export abstract class Type<T = any> {
  public get kind(): Typeable.Type { return Typeable.Type; }

  protected readonly options?: TypeOptions<T>;

  public get handlesUnset(): boolean { return false; }
  public get handlesSet(): boolean { return true; }

  /**
   * Is this type intended to handle this situation?
   *
   * @param value
   * @param options
   * @returns
   */
  public handles(value: unknown, options?: ParseValueOptions): boolean {
    const isSet = getIsSet(options);
    if (isSet && this.handlesSet) return true;
    if (!isSet && this.handlesUnset) return true;
    return false;
  }

  /**
   * Is the value a Type?
   *
   * @param value
   * @returns
   */
  public static is(value: unknown): value is Type {
    if (!value) return false;
    if ((value as any).kind === Typeable.Type) return true;
    return false;
  }

  /** fake property - helps type inference */
  public get _v(): T { throw new Error('Inaccessable property "_v"'); }

  /**
   * Try to parse the value
   *
   * @param unk
   * @param opts
   */
  abstract tryParse(unk: unknown, options?: ParseValueOptions): ParseResult<T>;

  /**
   * Parse the value
   *
   * @param from
   * @returns
   */
  public parse(from: unknown, options?: ParseValueOptions): T {
    const tried = this.tryParse(from, options);
    if (!tried.isSuccessful) throw new TypeError(`Failed to parse type: ${tried.reason}`);
    return tried.value;
  }

  /**
   * Union this type with another type
   */
  get or(): TypeOr<this> {
    return new TypeOr(this);
  }

  /**
   * Set the default value if the value is not given
   */
  default(value: T): UnionType<this, LiteralType<T>> {
    return this.or.literal(value, { behavior: LiteralBehavior.HandleUnsetOnly, });
  }

  /**
   * Parse as this type OR another type
   *
   * @param type
   * @returns
   */
  public union<V extends Type>(type: V): UnionType<this, V> {
    const t = new UnionType(this, type);
    return t;
  }
}

export class TypeOr<TA extends Type> {
  constructor(protected readonly root: TA) {}


  /**
   * Union this type with a Literal type
   *
   * @param options
   * @returns
   */
  literal<T>(value: T, options?: LiteralOptions<T>): UnionType<TA, LiteralType<T>> {
    return this.root.union(literal(value, options));
  }


  /**
   * Union of this type with a Boolean type
   *
   * @param options
   * @returns
   */
  boolean(options?: BooleanOptions): UnionType<TA, BooleanType> {
    return this.root.union(boolean(options));
  }

  /**
   * Union of this type with a Float type
   *
   * @param options
   * @returns
   */
  float(options?: FloatOptions): UnionType<TA, FloatType> {
    return this.root.union(float(options));
  }

  /**
   * Union of this type with an Integer type
   *
   * @param options
   * @returns
   */
  integer(options?: IntegerOptions): UnionType<TA, IntegerType> {
    return this.root.union(integer(options));
  }

  /**
   * Union of this type with a String type
   *
   * @param options
   * @returns
   */
  string(options?: StringOptions): UnionType<TA, StringType> {
    return this.root.union(string(options));
  }

  /**
   * Union of this type with a oneOf type
   *
   * @param values
   * @param options
   * @returns
   */
  oneOf<T>(values: readonly T[], options?: OneOfOptions<T>): UnionType<TA, OneOfType<T>> {
    return this.root.union(oneOf(values, options));
  }
}
