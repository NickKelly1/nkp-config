import { key } from './key';
import { literal } from './literal';
import { parse } from './parse';

describe('parse', () => {
  it('parses objects successfully', () => {
    const vars = { BOOL: true, };
    const result = parse({ bool: key('BOOL').boolean(), }, vars);
    expect(result.bool).toBe(true);
  });

  it('throws on missing values', () => {
    expect(() => {
      const vars = { BOOL: true, };
      parse({ bool: key('missing-key').boolean(), }, vars);
    }).toThrow(TypeError);
  });

  it('preserves non-parsed values', () => {
    const vars = {
      BOOL: true,
    };
    const result: {
      bool: boolean,
      lit: 'literal value',
    } = parse({
      bool: key('BOOL').boolean(),
      lit: literal<'literal value'>('literal value'),
    }, vars);
    expect(result.bool).toBe(true);
    expect(result.lit).toBe('literal value');
  });

  it('uses default values (with default)', () => {
    const vars = {
      BOOL: true,
    };
    const result = parse({
      bool: key('BOOG').boolean().default(false),
    }, vars);
    expect(result.bool).toBe(false);
  });


  it('uses default values (with literal)', () => {
    const vars = {
      BOOL: true,
    };
    const result = parse({
      bool: key('BOOG').boolean().or.literal(false),
    }, vars);
    expect(result.bool).toBe(false);
  });

  it('parses large objects', () => {
    const vars = {
      PORT: '3000',
      HOST: 'http://me.com',
      origins: 'http://example.com,http://google.com',
      NODE_ENV: 'development',
    };
    const env = parse({
      PORT: key('PORT').integer(),
      HOST: key('HOST').string(),
      ORIGINS: key('origins').string(),
      nodeenv: key('NODE_ENV').oneOf(['testing', 'production', 'development',] as const),
      missing: key('missing').oneOf(['abc', 'def',] as const).or.literal<'abc'>('abc'),
      keepingLiteral: literal<17>(17),
    }, vars);
    expect(env.PORT).toBe(3000);
    expect(env.HOST).toBe('http://me.com');
    expect(env.ORIGINS).toBe('http://example.com,http://google.com');
    expect(env.nodeenv).toBe('development');
    expect(env.missing).toBe('abc');
    expect(env.keepingLiteral).toBe(17);
  });
});
