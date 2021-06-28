import { OneOfType } from '.';

describe('OneOfType', () => {
  describe('successfully parses', () => {
    it('"production | development | testing" => "production"', () => {
      type Env = 'production' | 'development' | 'testing';
      const result = (new OneOfType<Env>([
        'production',
        'development',
        'testing'])).parse('production');
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
        'testing'])).parse('development');
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
        'testing'])).parse('testing');
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
        'string'])).parse(-1);
      expect(result.isSuccessful).toBe(true);
      if (result.isSuccessful) {
        expect (result.value).toBe(-1);
      }
    });

    it('"singular" => "singular', () => {
      type Options = 'singular';
      const result = (new OneOfType<Options>(['singular'])).parse('singular');
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
        'testing'])).parse('prod');
      expect(result.isSuccessful).toBe(false);
    });

    it('"production | development | testing" => undefined', () => {
      type Env = 'production' | 'development' | 'testing';
      const result = (new OneOfType<Env>([
        'production',
        'development',
        'testing'])).parse(undefined);
      expect(result.isSuccessful).toBe(false);
    });

    it('"production | development | testing" => null', () => {
      type Env = 'production' | 'development' | 'testing';
      const result = (new OneOfType<Env>([
        'production',
        'development',
        'testing'])).parse(null);
      expect(result.isSuccessful).toBe(false);
    });

    it('-1 | 0 | 1.5 | "string" => 0.0001', () => {
      type Options = -1 | 0 | 1.5 | 'string';
      const result = (new OneOfType<Options>([
        -1,
        0,
        1.5,
        'string'])).parse(0.0001);
      expect(result.isSuccessful).toBe(false);
    });
  });
});
