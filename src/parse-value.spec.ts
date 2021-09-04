import { parseValue } from '.';
import { boolean, float, integer, key } from './factories';
import { FloatType } from './types';
import { TypeKey } from './utils';

describe('parse-value', () => {
  describe('parses', () => {
    it('floats "5.01"', () => {
      expect(parseValue(key('key').as(float()), { key: 5.01, })).toBe(5.01);
    });
    it('integers "-1"', () => {
      expect(parseValue(key('key').as(integer()), { key: -1, })).toBe(-1);
    });
    it('booleans "false"', () => {
      expect(parseValue(key('key').as(boolean()), { key: false, })).toBe(false);
    });
  });

  describe('throws on unexpected', () => {
    it('non-integer "e"', () => {
      expect(() => parseValue(key('key').as(integer()), { key: 'e', })).toThrow(TypeError);
    });
    it('non-float "not a float"', () => {
      expect(() => parseValue(key('key').as(float()), { key: 'not a float', })).toThrow(TypeError);
    });
    it('non-boolean "-1"', () => {
      expect(() => parseValue(key('key').as(boolean()), { key: -1, })).toThrow(TypeError);
    });
    it('"undefined"', () => {
      expect(() => {
        parseValue(new TypeKey('key', new FloatType()), {});
      }).toThrow(TypeError);
    });
  });

  it('uses default values', () => {
    const result = parseValue(new TypeKey('key', new FloatType(5)), {});
    expect(result).toEqual(5);
  });
});
