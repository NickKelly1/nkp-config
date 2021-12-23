import {
  boolean,
  BooleanType,
  float,
  integer,
  IntegerType,
  StringType,
  UnionType
} from './circular-dependencies';
import { TypeKey } from './type-key';

describe('TypeKey', () => {
  it('Constructs a key-type pair', () => {
    const st = new StringType();
    const tk = new TypeKey('key', st);
    expect(tk.key).toBe('key');
    expect(tk.type).toBe(st);
  });

  describe('TypeKey.prototype.or', () => {
    it('produces a union of two Types', () => {
      const booleanType = new BooleanType();
      const tkBoolean = new TypeKey('key', booleanType);
      expect(tkBoolean.key).toBe('key');
      expect(tkBoolean.type).toBe(booleanType);

      const integerType = new IntegerType();
      const tkUnion = tkBoolean.union(integerType);
      expect(tkUnion.key).toBe('key');
      expect(tkUnion.type).toBeInstanceOf(UnionType);
      expect((tkUnion.type as UnionType<any, any>).tt).toBe(booleanType);
      expect((tkUnion.type as UnionType<any, any>).tu).toBe(integerType);
    });
  });

  describe('TypeKey.prototype.get', () => {
    it('parses the provided value', () => {
      const vars = {
        key: 5,
      };
      const st = new StringType();
      const tk = new TypeKey('key', st);
      const result = tk.parse(vars);
      expect(result);
    });
  });
});

describe('parse-value', () => {
  describe('parses', () => {
    it('floats "5.01"', () => {
      expect(new TypeKey('key', float()).parse({ key: 5.01, })).toBe(5.01);
    });
    it('integers "-1"', () => {
      expect(new TypeKey('key', integer()).parse({ key: -1, })).toBe(-1);
    });
    it('booleans "false"', () => {
      expect(new TypeKey('key', boolean()).parse({ key: false, })).toBe(false);
    });
  });

  describe('throws on unexpected', () => {
    it('non-integer "e"', () => {
      expect(() => new TypeKey('key', integer()).parse({ key: 'e', })).toThrow(TypeError);
    });
    it('non-float "not a float"', () => {
      expect(() => new TypeKey('key', float()).parse({ key: 'not a float', })).toThrow(TypeError);
    });
    it('non-boolean "-1"', () => {
      expect(() => new TypeKey('key', boolean()).parse({ key: -1, })).toThrow(TypeError);
    });
    it('"undefined"', () => {
      expect(() => { new TypeKey('key', float()).parse({}); }).toThrow(TypeError);
    });
  });

  it('uses default values', () => {
    const result = new TypeKey('key', float().or.literal(5)).parse();
    expect(result).toEqual(5);
  });
});
