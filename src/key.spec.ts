import { key, Key } from './key';
import { string, StringType } from './string';
import { TypeKey } from './type-key';

describe('Key', () => {
  it('Constructs a Key instance', () => {
    const key = new Key('mykeyname');
    expect(key).toBeInstanceOf(Key);
    expect(key.name).toBe('mykeyname');
  });

  describe('Key.prototype.as', () => {
    it('creates a TypeKey instance', () => {
      const key = new Key('mykeyname');
      const tk = key.as(string());
      expect(tk).toBeInstanceOf(TypeKey);
      expect(tk.type).toBeInstanceOf(StringType);
    });
  });
});

describe('key factory', () => {
  it('creates a key instance', () => {
    expect(key('name')).toBeInstanceOf(Key);
  });
});
