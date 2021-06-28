import { BooleanType } from '../types';
import { boolean } from '.';

describe('boolean factory', () => {
  it('creates a BooleanType', () => {
    expect(boolean()).toBeInstanceOf(BooleanType);
  });
});
