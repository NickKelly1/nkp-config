import { Type } from '../types';
import { TypeOptions } from './type-options';

export type UnionOptions<TA extends Type, TB extends Type> = TypeOptions<TA> & TypeOptions<TB>;
