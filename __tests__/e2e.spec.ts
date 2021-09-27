import {
  oneOf,
  parse,
  float,
  integer,
  string,
  boolean,
  key
} from '../src';

describe('e2e', () => {
  describe('exports', () => {
    it('oneOf', () => { expect(oneOf).toBeInstanceOf(Function); });
    it('float', () => { expect(float).toBeInstanceOf(Function); });
    it('integer', () => { expect(integer).toBeInstanceOf(Function); });
    it('string', () => { expect(string).toBeInstanceOf(Function); });
    it('boolean', () => { expect(boolean).toBeInstanceOf(Function); });
    it('parse', () => { expect(parse).toBeInstanceOf(Function); });
    it('parseObject', () => { expect(parse).toBeInstanceOf(Function); });
    it('key', () => { expect(key).toBeInstanceOf(Function); });
  });

  it('can parse an object', () => {
    const result = parse({
      environment: key('NODE_ENV').oneOf(['production', 'development', 'testing',] as const),
    }, {
      NODE_ENV: 'production',
    });
    expect(result.environment).toBe('production');
  });

  it('can parse a value', () => {
    const env = { NODE_ENV: 'production', };
    const environment = key('NODE_ENV').oneOf(['production', 'development', 'testing',] as const).parse(env);
    expect(environment).toBe('production');
  });
});
