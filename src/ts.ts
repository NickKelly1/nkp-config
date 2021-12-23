/**
 * Raw input "fromable" object
 */
export type Fromable = { readonly [K: PropertyKey]: unknown } | unknown;

/**
 * Normalised safe-to-parse fromable object
 */
export type NormalisedFromable = { readonly [K: PropertyKey]: unknown };

/**
 * Options given when parsing values
 */
export interface ParseInfo {
  isSet: boolean;
}

/**
 * Options to decide whether a property of an object is considered "set"
 */
export interface IsSetOptions {
  /**
   * Are empty strings considered "not set"
   */
  emptyIsNotSet?: boolean;

  /**
   * Is `null` considered "not set"
   */
  nullIsNotSet?: boolean;

  /**
   * Is `undefined` considered "not set"
   */
  undefinedIsNotSet?: boolean;
}


/**
 * Options to parse a value or key-value
 */
export interface ParserOptions extends IsSetOptions {
  //
}