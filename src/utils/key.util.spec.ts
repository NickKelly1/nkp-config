import { string } from '../factories';
import { StringType } from '../types';
import { Key } from '.';
import { TypeKey } from '.';

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
