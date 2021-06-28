import { OneOfType } from '../types';

/**
 * Parse as a one of a given set of values
 *
 * @param key
 * @param otherwise
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function oneOf<T>(values: readonly T[], otherwise?: T): OneOfType<T> {
  return new OneOfType(values, otherwise);
}
