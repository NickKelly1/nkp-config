import { OneOfType } from '../types';
import { oneOf } from '.';

describe('oneOf factory', () => {
  it('creates an OneOfType', () => {
    expect(oneOf(['a', 'b', 'c',])).toBeInstanceOf(OneOfType);
  });
});
