import { StringType } from '../types';
import { string } from './string.factory';

describe('string factory', () => {
  it('creates a StringType', () => {
    expect(string()).toBeInstanceOf(StringType);
  });
});
