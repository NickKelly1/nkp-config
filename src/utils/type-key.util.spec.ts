import { BooleanType, IntegerType, StringType, UnionType } from '../types';
import { TypeKey } from './type-key.util';

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
      const tkUnion = tkBoolean.or(integerType);
      expect(tkUnion.key).toBe('key');
      expect(tkUnion.type).toBeInstanceOf(UnionType);
      expect(tkUnion.type.ta).toBe(booleanType);
      expect(tkUnion.type.tb).toBe(integerType);
    });
  });

  describe('TypeKey.prototype.get', () => {
    it('parses the provided value', () => {
      const vars = {
        key: 5,
      };
      const st = new StringType();
      const tk = new TypeKey('key', st);
      const result = tk.get(vars);
      expect(result);
    });
  });
});
