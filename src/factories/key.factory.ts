import { Key } from '../utils';

/**
 * Create an object containing the target key in the config
 *
 * @param name
 * @returns
 */
export function key(name: string): Key {
  return new Key(name);
}
