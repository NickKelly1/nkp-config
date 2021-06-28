import { Type } from '../types';
import { TypeValue } from './type-value';

export type UnionValue<TA extends Type, TB extends Type> = TypeValue<TA> | TypeValue<TB>;
