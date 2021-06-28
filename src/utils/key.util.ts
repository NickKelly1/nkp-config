import { Type } from '../types';
import { TypeKey } from './type-key.util';

export class Key {
  constructor(public readonly name: string) {}

  /**
   * Parse the keys value as the given type
   *
   * @param type
   * @returns
   */
  as<T extends Type>(type: T): TypeKey<T> {
    return new TypeKey(this.name, type);
  }
}
