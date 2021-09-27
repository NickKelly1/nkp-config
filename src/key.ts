import { TypeKey } from './type-key';
import { Type } from './type';
import { BooleanOptions, BooleanType, boolean } from './boolean';
import { FloatOptions, FloatType, float } from './float';
import { IntegerOptions, IntegerType, integer } from './integer';
import { OneOfOptions, OneOfType, oneOf } from './one-of';
import { StringOptions, StringType, string } from './string';
import { literal, LiteralOptions, LiteralType } from './literal';

export class Key {
  constructor(public readonly name: string) {}

  /**
   * Parse the keys value as the given type
   *
   * @param type
   * @returns
   */
  as<T extends Type>(type: T): TypeKey<T> {
    return new TypeKey(this.name, type);
  }

  /**
   * Parse this key as this literal value
   *
   * @param options
   * @returns
   */
  literal<T>(value: T, options?: LiteralOptions<T>): TypeKey<LiteralType<T>> {
    return new TypeKey(this.name, literal(value, options));
  }

  /**
   * Parse this key as an Integer
   *
   * @param options
   * @returns
   */
  integer(options?: IntegerOptions): TypeKey<IntegerType> {
    return new TypeKey(this.name, integer(options));
  }

  /**
   * Parse this vlaue as a boolean
   *
   * @param options
   * @returns
   */
  boolean(options?: BooleanOptions): TypeKey<BooleanType> {
    return new TypeKey(this.name, boolean(options));
  }

  /**
   * Parse this value as a float
   *
   * @param options
   * @returns
   */
  float(options?: FloatOptions): TypeKey<FloatType> {
    return new TypeKey(this.name, float(options));
  }

  /**
   * Parse this value as oneOf a set of values
   *
   * @param values
   * @param options
   * @returns
   */
  oneOf<T>(values: readonly T[], options?: OneOfOptions<T>): TypeKey<OneOfType<T>> {
    return new TypeKey(this.name, oneOf(values, options));
  }

  /**
   * Parse this value as a string
   *
   * @param options
   * @returns
   */
  string(options?: StringOptions): TypeKey<StringType> {
    return new TypeKey(this.name, string(options));
  }
}

/**
 * Create an object containing the target key in the config
 *
 * @param name
 * @returns
 */
export function key(name: string): Key {
  return new Key(name);
}
