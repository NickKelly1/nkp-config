import { OneOfType, oneOf } from './one-of';

describe('OneOfType', () => {
  describe('successfully parses', () => {
    it('"production | development | testing" => "production"', () => {
      type Env = 'production' | 'development' | 'testing';
      const result = (new OneOfType<Env>([
        'production',
        'development',
        'testing',])).tryParse('production');
      expect(result.isSuccessful).toBe(true);
      if (result.isSuccessful) {
        expect (result.value).toBe('production');
      }
    });

    it('"production | development | testing" => "development"', () => {
      type Env = 'production' | 'development' | 'testing';
      const result = (new OneOfType<Env>([
        'production',
        'development',
        'testing',])).tryParse('development');
      expect(result.isSuccessful).toBe(true);
      if (result.isSuccessful) {
        expect (result.value).toBe('development');
      }
    });

    it('"production | development | testing" => "testing"', () => {
      type Env = 'production' | 'development' | 'testing';
      const result = (new OneOfType<Env>([
        'production',
        'development',
        'testing',])).tryParse('testing');
      expect(result.isSuccessful).toBe(true);
      if (result.isSuccessful) {
        expect (result.value).toBe('testing');
      }
    });

    it('-1 | 0 | 1.5 | "string" => -1', () => {
      type Options = -1 | 0 | 1.5 | 'string';
      const result = (new OneOfType<Options>([
        -1,
        0,
        1.5,
        'string',])).tryParse(-1);
      expect(result.isSuccessful).toBe(true);
      if (result.isSuccessful) {
        expect (result.value).toBe(-1);
      }
    });

    it('"singular" => "singular', () => {
      type Options = 'singular';
      const result = (new OneOfType<Options>(['singular',])).tryParse('singular');
      expect(result.isSuccessful).toBe(true);
      if (result.isSuccessful) {
        expect (result.value).toBe('singular');
      }
    });
  });

  describe('fails to parses', () => {
    it('"production | development | testing" => "prod"', () => {
      type Env = 'production' | 'development' | 'testing';
      const result = (new OneOfType<Env>([
        'production',
        'development',
        'testing',])).tryParse('prod');
      expect(result.isSuccessful).toBe(false);
    });

    it('"production | development | testing" => undefined', () => {
      type Env = 'production' | 'development' | 'testing';
      const result = (new OneOfType<Env>([
        'production',
        'development',
        'testing',])).tryParse(undefined);
      expect(result.isSuccessful).toBe(false);
    });

    it('"production | development | testing" => null', () => {
      type Env = 'production' | 'development' | 'testing';
      const result = (new OneOfType<Env>([
        'production',
        'development',
        'testing',])).tryParse(null);
      expect(result.isSuccessful).toBe(false);
    });

    it('-1 | 0 | 1.5 | "string" => 0.0001', () => {
      type Options = -1 | 0 | 1.5 | 'string';
      const result = (new OneOfType<Options>([
        -1,
        0,
        1.5,
        'string',])).tryParse(0.0001);
      expect(result.isSuccessful).toBe(false);
    });
  });
});

describe('oneOf factory', () => {
  it('creates an OneOfType', () => {
    expect(oneOf(['a', 'b', 'c',])).toBeInstanceOf(OneOfType);
  });
});
