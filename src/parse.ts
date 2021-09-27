import { Fromable, normaliseFromable } from './ts';
import { Type } from './type';
import { TypeKey } from './type-key';
import { hasOwn } from './utils';


/**
 * Parse an object whose keys are configured
 *
 * @param shape
 * @param from
 * @returns
 */
export function parse<T extends { readonly [K: PropertyKey]: Type | TypeKey }>(
  shape: T,
  from: Fromable = (typeof process !== 'undefined' && process && process?.env) || {},
): {
  // types are not aliased (they are inlined) to provide better type hinting for the consumer
  [K in keyof T]: T[K] extends TypeKey
    ? T[K]['type']['_v']
    : T[K] extends Type
      ? T[K]['_v']
      : T[K];
} {
  const _from = normaliseFromable(from);
  const parsed = {} as Record<PropertyKey, unknown>;

  const parseErrors: string[] = [];
  const criticalErrors: string[] = [];

  (Object.getOwnPropertySymbols(shape) as PropertyKey[])
    .concat(Object.getOwnPropertyNames(shape))
    .forEach((key) => {
      const tk: unknown | Type | TypeKey = shape[key]!;
      if (TypeKey.is(tk)) {
        const result = tk.tryParse(_from);
        if (result.isSuccessful) parsed[key] = result.value;
        else parseErrors.push(result.reason);
      }
      else if (Type.is(tk)) {
        const isSet = hasOwn(_from, key);
        if (tk.handles(_from[key], { isSet, })) {
          const value = _from[key];
          const result = tk.tryParse(value, { isSet, });
          if (result.isSuccessful) parsed[key] = result.value;
          else parseErrors.push(TypeKey.toReason(key, result.reason));
        } else {
          if (isSet) parseErrors.push(TypeKey.toReason(key, 'value is set'));
          else parseErrors.push(TypeKey.toReason(key, 'value is not set'));
        }
      }
      else {
        criticalErrors.push(`Input "<shape>.${String(key)}" must be either a ${Type.name} or ${TypeKey.name}`);
      }
    });

  if (criticalErrors.length) {
    throw new TypeError(`Bad input:\n${criticalErrors.map((e, i) => `\t${i + 1}. ${e}`).join('\n')}`);
  }

  if (parseErrors.length) {
    throw new TypeError(`Failed to parse object:\n${parseErrors.map((e, i) => `\t${i + 1}. ${e}`).join('\n')}`);
  }

  return parsed as any;
}
