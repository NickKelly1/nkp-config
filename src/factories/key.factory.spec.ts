import { Key } from '../utils';
import { key } from '.';

describe('key factory', () => {
  it('creates a key instance', () => {
    expect(key('name')).toBeInstanceOf(Key);
  });
});
