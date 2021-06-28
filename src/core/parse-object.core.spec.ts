import { parse, parseObject } from '.';
import { boolean, integer, key } from '../factories';
import { oneOf } from '../factories/one-of.factory';
import { string } from '../factories/string.factory';

describe('parse-object', () => {
  it('parses objects successfully', () => {
    const vars = { BOOL: true, };
    const result = parse({ bool: key('BOOL').as(boolean()) }, vars);
    expect(result.bool).toBe(true);
  });

  it('throws on missing values', () => {
    expect(() => {
      const vars = { BOOL: true, };
      parseObject({ bool: key('missing-key').as(boolean()) }, vars);
    }).toThrow(TypeError);
  });

  it('preserves non-parsed values', () => {
    const vars = {
      BOOL: true,
    };
    const result = parseObject({
      bool: key('BOOL').as(boolean()),
      preserved: 'i\'m still here',
    }, vars);
    expect(result.bool).toBe(true);
    expect(result.preserved).toBe('i\'m still here');
  });


  it('uses default values', () => {
    const vars = { BOOL: true, };
    const result = parseObject({ bool: key('BOOG').as(boolean(false)) }, vars);
    expect(result.bool).toBe(false);
  });

  it('parses large objects', () => {
    const vars = {
      PORT: '3000',
      HOST: 'http://me.com',
      origins: 'http://example.com,http://google.com',
      NODE_ENV: 'development',
    };
    const env = parseObject({
      PORT: key('PORT').as(integer()),
      HOST: key('HOST').as(string()),
      ORIGINS: key('origins').as(string()),
      nodeenv: key('NODE_ENV').as(oneOf(['testing', 'production', 'development'] as const)),
      missing: key('missing').as(oneOf(['abc', 'def',] as const, 'abc')),
      keepingLiteral: 17
    }, vars);
    expect(env.PORT).toBe(3000);
    expect(env.HOST).toBe('http://me.com');
    expect(env.ORIGINS).toBe('http://example.com,http://google.com');
    expect(env.nodeenv).toBe('development');
    expect(env.missing).toBe('abc');
    expect(env.keepingLiteral).toBe(17);
  });
});
