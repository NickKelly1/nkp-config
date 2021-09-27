export type Fromable = { readonly [K: PropertyKey]: unknown } | unknown;
export type NormalisedFromable = { readonly [K: PropertyKey]: unknown };

const noobj = Object.create(null);
export function normaliseFromable(arg: Fromable): NormalisedFromable {
  if (!arg) return noobj;
  if (typeof arg === 'object') return arg as NormalisedFromable;
  return noobj;
}

/**
 * Represents a successful parse
 */
export class ParseSuccess<T> {
  public readonly isSuccessful: true = true;
  constructor(public readonly value: T) {}
  // unwrap(): T { return this.value; }
}

/**
 * Represents a failed parse
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ParseFail<T = any> {
  public readonly isSuccessful: false = false;
  constructor(public readonly reason: string) {}
  // unwrap(): T { throw new ReferenceError(this.reason); }
}

/**
 * A possible result of a parsing operator
 */
export type ParseResult<T> = ParseSuccess<T> | ParseFail<T>;

/**
 * Options given when parsing values
 */
export interface ParseValueOptions { isSet?: boolean }
