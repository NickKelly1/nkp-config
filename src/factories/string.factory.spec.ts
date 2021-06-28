import { StringType } from '../types';
import { string } from '.';

describe('string factory', () => {
  it('creates a StringType', () => {
    expect(string()).toBeInstanceOf(StringType);
  });
});
