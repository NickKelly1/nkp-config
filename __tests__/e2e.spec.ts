import {
  oneOf,
  parse,
  float,
  integer,
  string,
  boolean,
  parseObject,
  parseValue,
  key,
  Key,
  TypeKey,
  BooleanType,
  FloatType,
  IntegerType,
  StringType,
  Type
} from '../src';

describe('e2e', () => {
  describe('exports', () => {
    it('oneOf', () => { expect(oneOf).toBeInstanceOf(Function); });
    it('float', () => { expect(float).toBeInstanceOf(Function); });
    it('integer', () => { expect(integer).toBeInstanceOf(Function); });
    it('string', () => { expect(string).toBeInstanceOf(Function); });
    it('boolean', () => { expect(boolean).toBeInstanceOf(Function); });
    it('parse', () => { expect(parse).toBeInstanceOf(Function); });
    it('parseValue', () => { expect(parseValue).toBeInstanceOf(Function); });
    it('parseObject', () => { expect(parseObject).toBeInstanceOf(Function); });
    it('key', () => { expect(key).toBeInstanceOf(Function); });
    it('Key', () => { expect(Key).toBeInstanceOf(Function); });
    it('TypeKey', () => { expect(TypeKey).toBeInstanceOf(Function); });
    it('Type', () => { expect(Type).toBeInstanceOf(Function); });
    it('StringType', () => { expect(StringType).toBeInstanceOf(Function); });
    it('IntegerType', () => { expect(IntegerType).toBeInstanceOf(Function); });
    it('FloatType', () => { expect(FloatType).toBeInstanceOf(Function); });
    it('BooleanType', () => { expect(BooleanType).toBeInstanceOf(Function); });
  });

  it('can parse an object', () => {
    const result = parse({
      environment: key('NODE_ENV').as(oneOf(['production', 'development', 'testing',] as const)),
    }, {
      NODE_ENV: 'production',
    });
    expect(result.environment).toBe('production');
  });

  it('can parse a value', () => {
    const env = { NODE_ENV: 'production', };
    const environment = key('NODE_ENV').as(oneOf(['production', 'development', 'testing',] as const)).get(env);
    expect(environment).toBe('production');
  });
});
