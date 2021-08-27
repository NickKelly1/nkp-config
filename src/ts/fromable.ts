export type Fromable = Record<string, unknown> | unknown;
export type NormalisedFromable = Record<string, unknown>;

export function normaliseFromable(arg: Fromable): NormalisedFromable {
  if (!arg) return {};
  if (typeof arg === 'object') return arg as NormalisedFromable;
  return {};
}
