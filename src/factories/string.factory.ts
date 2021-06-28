import { StringType } from '../types';

/**
 * Parse as a string
 *
 * @param key
 * @param otherwise
 * @returns
 */
export function string(otherwise?: string): StringType {
  return new StringType(otherwise);
}
