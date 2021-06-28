import { TypeValue } from '.';
import { TypeKey } from '../utils';

export type TypeKeyValue<T extends TypeKey> = TypeValue<T['type']>
