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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ParseFail<T = any> {
  public readonly isSuccessful: false = false;
  constructor(public readonly reason: string) {}
  // unwrap(): T { throw new ReferenceError(this.reason); }
}

/**
 * A possible result of a parsing operator
 */
export type ParseResult<T> = ParseSuccess<T> | ParseFail<T>;
