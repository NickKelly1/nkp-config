import { IntegerType } from '../types';

/**
 * Parse as an integer
 *
 * @param key
 * @param otherwise
 * @returns
 */
export function integer(otherwise?: number): IntegerType {
  return new IntegerType(otherwise);
}
