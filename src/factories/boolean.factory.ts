import { BooleanType } from '../types';

/**
 * Parse as a boolean
 *
 * @param key
 * @param otherwise
 * @returns
 */
export function boolean(otherwise?: boolean): BooleanType {
  return new BooleanType(otherwise);
}
