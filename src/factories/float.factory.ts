import { FloatType } from '../types/float.type';

/**
 * Parse as a float
 *
 * @param key
 * @param otherwise
 * @returns
 */
export function float(otherwise?: number): FloatType {
  return new FloatType(otherwise);
}

