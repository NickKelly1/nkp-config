import { StringType, string } from './circular-dependencies';
import { Parse } from './parse';

describe('StringType', () => {
  describe('successfully parses', () => {
    describe('strings', () => {
      it('"some string"', () => {
        const result = (new StringType()).tryParse('some string');
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) {
          expect (result.value).toBe('some string');
        }
      });

      it('empty string', () => {
        const result = (new StringType()).tryParse('');
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) {
          expect (result.value).toBe('');
        }
      });
    });

    describe('integers', () => {
      it('5', () => {
        const result = (new StringType()).tryParse(5);
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) {
          expect (result.value).toBe('5');
        }
      });

      it('Number.MAX_SAFE_INTEGER.', () => {
        const result = (new StringType()).tryParse(Number.MAX_SAFE_INTEGER);
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) {
          expect (result.value).toBe(String(Number.MAX_SAFE_INTEGER));
        }
      });
    });

    describe('floats', () => {
      it('3.14159', () => {
        const result = (new StringType()).tryParse(3.14159);
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) {
          expect (result.value).toBe('3.14159');
        }
      });

      it('10e9 -> 10000000000', () => {
        const result = (new StringType()).tryParse(10e9);
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) {
          expect (result.value).toBe('10000000000');
        }
      });
    });

    describe('booleans', () => {
      it('true', () => {
        const result = (new StringType()).tryParse(true);
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) {
          expect (result.value).toBe('true');
        }
      });

      it('false', () => {
        const result = (new StringType()).tryParse(false);
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) {
          expect (result.value).toBe('false');
        }
      });
    });

    describe('bigints', () => {
      it('BigInt(999_999_999_999)', () => {
        const result = (new StringType()).tryParse(BigInt(999_999_999_999));
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) {
          expect (result.value).toBe('999999999999');
        }
      });

      it('BigInt(Number.MAX_SAFE_INTEGER)', () => {
        const result = (new StringType()).tryParse(BigInt(Number.MAX_SAFE_INTEGER));
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) {
          expect (result.value).toBe(String(Number.MAX_SAFE_INTEGER));
        }
      });
    });
  });

  describe('fails to parse', () => {
    describe('functions', () => {
      it('new Function()', () => {
        const result = (new StringType()).tryParse(new Function());
        expect(Parse.isSuccess(result)).toBe(false);
      });
      it('function() {}', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const result = (new StringType()).tryParse(function() {});
        expect(Parse.isSuccess(result)).toBe(false);
      });
    });

    describe('objects', () => {
      it('{}', () => {
        const result = (new StringType()).tryParse({});
        expect(Parse.isSuccess(result)).toBe(false);
      });
      it('Object', () => {
        const result = (new StringType()).tryParse(Object);
        expect(Parse.isSuccess(result)).toBe(false);
      });
      it('Function', () => {
        const result = (new StringType()).tryParse(Function);
        expect(Parse.isSuccess(result)).toBe(false);
      });
    });

    describe('arrays', () => {
      it('[]', () => {
        const result = (new StringType()).tryParse([]);
        expect(Parse.isSuccess(result)).toBe(false);
      });
      it('[1, 2, 3]', () => {
        const result = (new StringType()).tryParse([1, 2, 3,]);
        expect(Parse.isSuccess(result)).toBe(false);
      });
    });
  });
});

describe('string factory', () => {
  it('creates a StringType', () => {
    expect(string()).toBeInstanceOf(StringType);
  });
});
