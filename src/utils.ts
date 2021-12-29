import { Fromable, IsSetOptions, NormalisedFromable, ParseInfo } from './ts';

/**
 * Nothing object with no prototype
 */
const noobj = Object.create(null);

/**
 * Default "from" object
 *
 * Tries to use process.env, otherwise just uses empty object
 *
 * @returns
 */
export function defaultFromable(): Fromable {
  // probably not in NodeJS
  if (typeof process === 'undefined') return noobj;

  // process.env is not a typeof object
  if (!(typeof process.env === 'object')) return noobj;

  // process.env is null
  if (!process.env) return noobj;

  // process.env a typeof object and is not nul and is an object
  return process.env;
}

/**
 * Normalise a raw Fromable object
 *
 * Takes raw consumer input and returns a parseable type
 *
 * @param arg     raw inputted "from" object
 * @returns       safely parseable from object
 */
export function normaliseFromable(arg: Fromable): NormalisedFromable {
  if (!arg) return noobj;
  if (typeof arg === 'object') return arg as NormalisedFromable;
  return noobj;
}

const defaultIsSetOptions: Required<IsSetOptions> = {
  emptyIsNotSet: true,
  nullIsNotSet: true,
  undefinedIsNotSet: true,
};

/**
 * Is the target property of a host object set?
 *
 * @param host        host object
 * @param target      target property
 */
export function isPropertySet(
  host: unknown,
  target: PropertyKey,
  options?: IsSetOptions,
): boolean {
  const has = hasOwn(host, target);

  // get settings
  const emptyIsNotSet = options?.emptyIsNotSet ?? defaultIsSetOptions.emptyIsNotSet;
  const nullIsNotSet = options?.nullIsNotSet ?? defaultIsSetOptions.nullIsNotSet;
  const undefinedIsNotSet = options?.undefinedIsNotSet ?? defaultIsSetOptions.undefinedIsNotSet;

  // property is definitely not set - it is not an "own" property
  if (!has) return false;

  const value: any = (host as any)[target];

  // empty string?
  if (emptyIsNotSet && value === '') return false;

  // null?
  if (nullIsNotSet && value === null) return false;

  // undefined?
  if (undefinedIsNotSet && value === undefined) return false;

  // passed all checks
  return true;
}

/**
 * Get "isSet" from the ParseValueOptions
 *
 * @param options
 * @returns
 */
export function getIsSet(options?: ParseInfo): boolean {
  return !(options?.isSet === false);
}

/**
 * Object.prototype.hasOwnPropertyy
 *
 * @param object          host object
 * @param property        target property
 * @returns               does the host object have the target property
 */
export function hasOwn(object: unknown, property: PropertyKey): boolean {
  if (!object) return false;
  try {
    return Object.prototype.hasOwnProperty.call(object, property);
  } catch (e) {
    return false;
  }
}

/**
 * Indent by `width` spaces
 *
 * @param width     number of spaces to indent by
 * @returns         string of spaces
 */
export function indent(width: number): string {
  return ' '.repeat(width);
}

/**
 * Is the value defined? (not null or undefined)
 *
 * @param value     the value
 * @returns         whether the value is defined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value != null;
}