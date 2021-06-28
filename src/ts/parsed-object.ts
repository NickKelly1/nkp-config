import { ParseableObject, TypeValue } from '.';
import { TypeKey } from '../utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParsedObject<T extends ParseableObject<any>> = {
  // convert TypeKeys into their types values, and non TypeKeys into their values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends TypeKey ? TypeValue<T[K]['type']> : T[K];
};
