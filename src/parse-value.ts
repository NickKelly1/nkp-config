import { Fromable, normaliseFromable } from './ts';
import { TypeKeyValue } from './ts';
import { TypeKey } from './utils';

/**
 * Parse a value
 *
 * @param tk
 * @param value
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseValue<TK extends TypeKey>(tk: TK, from: Fromable = process.env): TypeKeyValue<TK> {
  const value = normaliseFromable(from)[tk.key as keyof Record<string, unknown>];
  if (value === undefined) {
    // value is missing on the from obejct
    if (tk.type.otherwise === undefined) {
      // no default valuesis specified
      throw new TypeError(`${tk.key} is not defined`);
    }
    // use the default value
    return tk.type.otherwise;
  }
  const result = tk.type.parse(value);
  if (!result.isSuccessful) throw new TypeError(`${tk.key} ${result.reason}`);
  return result.value;
}
