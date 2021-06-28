import { TypeKey } from '../utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParseableObject<T extends TypeKey = TypeKey> = Record<string, unknown | T>;
