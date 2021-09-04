import { parseValue, parse } from '.';
import { boolean, float, key } from './factories';
import { BooleanType, FloatType, IntegerType } from './types';
import { TypeKey } from './utils';

describe('parse', () => {
  describe('parses as a value when given a TypeKey', () => {
    it('floats "5.01"', () => {
      const tk: TypeKey<FloatType> = key('key').as(float());
      const result = parse(tk, { key: 5.01, });
      expect(result).toBe(5.01);
    });
    it('integers "-1"', () => {
      const tk: TypeKey<IntegerType> = key('key').as(float());
      const result = parse(tk, { key: -1, });
      expect(result).toBe(-1);
    });
    it('booleans "false"', () => {
      const tk: TypeKey<BooleanType> = key('key').as(boolean());
      const result = parseValue(tk, { key: false, });
      expect(result).toBe(false);
    });
  });

  describe('parses as an object when given a non TypeKey object', () => {
    it('parses objects successfully', () => {
      const vars = { BOOL: true, };
      const result = parse({ bool: key('BOOL').as(boolean()), }, vars);
      expect(result.bool).toBe(true);
    });

    it('preserves non-parsed values', () => {
      const vars = {
        BOOL: true,
      };
      const result = parse({
        bool: key('BOOL').as(boolean()),
        preserved: 'i\'m still here',
      }, vars);
      expect(result.bool).toBe(true);
      expect(result.preserved).toBe('i\'m still here');
    });
  });
});
