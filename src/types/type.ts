import { UnionType } from '.';
import { ParseResult } from '../ts';

/**
 * Represents a parseable type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class Type<T = any, O = unknown> {
  /** fake property - helps type inference */
  public get _v(): T { throw new Error('Inaccessable property "_v"'); }
  /** fake property - helps type inference */
  public get _o(): O { throw new Error('Inaccessable property "_o"'); }

  constructor(public otherwise?: T) {}

  abstract parse(unk: unknown, opts?: O): ParseResult<T>;

  /**
   * Parse as this type OR another type
   *
   * @param type
   * @returns
   */
  or<V extends Type>(type: V): UnionType<this, V> {
    const t = new UnionType(this, type);
    return t;
  }
}
