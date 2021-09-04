import { parseValue } from '../parse-value';
import { Fromable, TypeValue } from '../ts';
import { Type, UnionType } from '../types';

/**
 * Tuple of Key and Type
 *
 * Key is of an object being parsed
 * Type is the parser for the keys value
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class TypeKey<TA extends Type = Type> {
  constructor(
    public readonly key: string,
    public readonly type: TA
  ) {
    //
  }

  /**
   * Parse as this TypeKey's type OR another type
   *
   * @param type
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  or<TB extends Type>(orType: TB): TypeKey<UnionType<TA, TB>> {
    return new TypeKey(this.key, this.type.or(orType));
  }

  /**
   * Parse the value out using the type
   */
  get(from: Fromable = (typeof process !== 'undefined' && process && process?.env) || {}): TypeValue<TA> {
    return parseValue(this, from);
  }
}
