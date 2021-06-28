import { IntegerType } from '../types';
import { integer } from '.';

describe('integer factory', () => {
  it('creates an IntegerType', () => {
    expect(integer()).toBeInstanceOf(IntegerType);
  });
});
