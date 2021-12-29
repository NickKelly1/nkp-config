import { Parse } from './parse';
import { Fromable } from './ts';
import { Type } from './type';
import { TypeKey } from './type-key';
import {
  defaultFromable,
  isPropertySet,
  normaliseFromable
} from './utils';

export type Shape = { readonly [K: PropertyKey]: Type | TypeKey; }

/**
 * Parse an object whose keys are configured
 *
 * @param shape         expected shape to parse as
 * @param from          object to parse
 * @returns             success result
 *
 * @throws              on parse error
 */
export function parse<T extends Shape>(
  shape: T,
  from: Fromable = defaultFromable(),
): {
  /**
   * types are inlined (not aliased) to provide better type hinting for the consumer
   * if we instead used a type alias like type Output<T> = ...
   * then the consumer would be type hinted with `Output<{ val1: Type<string>, ... }>` when
   * hovering the output, instead of `{ val1: string, ... }`
   */
    [K in keyof T]: T[K] extends TypeKey
      ? T[K]['type']['_v']
      : T[K] extends Type
        ? T[K]['_v']
        : T[K];
  } {
  const _from = normaliseFromable(from);
  const parsed = {} as Record<PropertyKey, unknown>;

  const parseErrors: [PropertyKey, Parse.Fail][] = [];
  const criticalErrors: string[] = [];

  // only seek properties on the "own" object itself, not prototypes
  const parsingSymbols: PropertyKey[] = Object.getOwnPropertySymbols(shape);
  const parsingNames = Object.getOwnPropertyNames(shape);
  const parsingProperties: PropertyKey[] = parsingSymbols.concat(parsingNames);

  for (let i = 0; i < parsingProperties.length; i += 1) {
    const key = parsingProperties[i] as PropertyKey;
    const tk: unknown | Type | TypeKey = shape[key]!;

    // parse as TypeKey
    if (TypeKey.is(tk)) {
      // let the TypeKey handle parsing
      const result = tk.tryParse(_from);

      if (Parse.isSuccess(result)) {
        // successfully parsed
        parsed[key] = result.value;
        continue;
      }

      // failed to parse
      parseErrors.push([key, result.value,]);
      continue;
    }

    // parse as Type with no key information
    if (Type.is(tk)) {
      // handle parsing ourselves
      const isSet = isPropertySet(_from, key);
      const value = _from[key];
      const result = tk.tryParse(value, { isSet, });
      if (Parse.isSuccess(result)) {
        // successfully parsed
        parsed[key] = result.value;
        continue;
      }
      // failed to parse
      parseErrors.push([key, result.value,]);
      continue;
    }

    // key isn't a Type or TypeKey
    // something went very wrong!
    criticalErrors.push(`Input "<shape>.${String(key)}" must be either a ${Type.name} or ${TypeKey.name}`);
  }

  // any critical errors?
  if (criticalErrors.length) {
    const msg = `Bad input:\n${criticalErrors
      .map((e, i) => `\t${i + 1}. ${e}`)
      .join('\n')}`;
    throw new TypeError(msg);
  }

  // any parsing errors?
  if (parseErrors.length) {
    const msg = 'Invalid object:'
      + '\n'
      + parseErrors
        // give each line initial indentation
        .map(([key, fail,], i) => `  ${i + 1}. ${TypeKey
          .toFailureReason(key, fail)
          .split('\n')
          .map(line => '  ' + line)}`)
        .join('\n');
    throw new TypeError(msg);
  }

  return parsed as any;
}
