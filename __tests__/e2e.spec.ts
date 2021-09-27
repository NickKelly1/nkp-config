import {
  oneOf,
  parse,
  float,
  integer,
  string,
  boolean,
  key
} from '../src';
import * as c from '../src';

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

  it('readme', () => {
    /**
     * the parse function correctly sets the type of `config`
     * {
     *  DEBUG: false;
     *  MAIL: string | undefined;
     *  HOST: string;
     *  PORT: number;
     *  env: 'development' | 'testing' | 'production';
     * }
     */
    const config = c.parse({
      // coerces DEBUG is a boolean defaulting to false if not provided
      DEBUG: c.boolean().default(false),

      // coerces MAIL_HOST to string, or leaves undefined if it doesn't exist
      MAIL_HOST: c.string().optional(),

      // coerces process.env.HOST to string
      HOST: c.string() ,

      // coerces process.env.PORT to string
      // if not provided, defaults to 3000
      PORT: c.integer().default(3000),

      // ensures procese.env.NODE_ENV is one of the given values
      env: c
        .key('NODE_ENV')
        .oneOf(['development', 'testing', 'production',] as const),
    }, {
      HOST: 'localhost',
      NODE_ENV: 'development',
    });

    expect(config.DEBUG).toBe(false);
    expect(config.MAIL_HOST).toBe(undefined);
    expect(config.HOST).toBe('localhost');
    expect(config.PORT).toBe(3000);
    expect(config.env).toBe('development');
  });
});
