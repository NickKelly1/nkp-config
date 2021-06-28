import { parseValue } from '.';
import { Fromable, ParseableObject, ParsedObject } from '../ts';
import { TypeKey } from '../utils';

/**
 * Parse an object whose keys are configured
 *
 * @param parseable
 * @param from
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseObject<T extends ParseableObject<any>>(
  parseable: T,
  from: Fromable = process.env,
): ParsedObject<T> {
  const parsed = {} as ParsedObject<T>;
  Object
    .entries(parseable)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .forEach(([pk, kv]: [string, unknown | TypeKey<any>]) => {
      if (kv instanceof TypeKey) {
        parsed[pk as keyof ParsedObject<T>]= parseValue(kv, from);
      } else {
        // non TypeKey value - assume it's a literal and keep it
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parsed[pk as keyof ParsedObject<T>] = kv as any;
      }
    });
  return parsed;
}
