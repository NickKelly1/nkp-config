import { Fromable, ParseableObject, ParsedObject, TypeKeyValue } from '../ts';
import { TypeKey } from '../utils';
import { parseObject } from './parse-object.core';
import { parseValue } from './parse-value.core';

/**
 * Parse an object or value
 *
 * @param tk
 * @param from
 */
export function parse<TK extends TypeKey>(tk: TK, from?: Fromable): TypeKeyValue<TK>;
export function parse<P extends ParseableObject>(parseable: P, from?: Fromable): ParsedObject<P>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parse<Q extends TypeKey | ParseableObject>(
  mb: Q,
  from?: Fromable
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Q extends TypeKey ? TypeKeyValue<Q> : Q extends ParseableObject ? ParsedObject<Q> : any {
  // TODO: simplify typings
  const _from = from ?? process.env;
  if (mb instanceof TypeKey) return parseValue(mb, _from);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return parseObject(mb as ParseableObject, _from) as any;
}
