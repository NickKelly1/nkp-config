import { FloatType } from '../types';
import { float } from '.';

describe('float factory', () => {
  it('creates a FloatType', () => {
    expect(float()).toBeInstanceOf(FloatType);
  });
});
