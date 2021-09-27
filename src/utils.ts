import { ParseValueOptions } from './ts';

export function getIsSet(options?: ParseValueOptions): boolean {
  return !(options?.isSet === false);
}

/**
 * Object.prototype.hasOwnPropertyy
 *
 * @param object
 * @param property
 * @returns
 */
export function hasOwn(object: unknown, property: PropertyKey): boolean {
  if (!object) return false;
  try {
    return Object.prototype.hasOwnProperty.call(object, property);
  } catch (e) {
    return false;
  }
}
