import { Type } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TypeValue<T extends Type> = T['_v'];
