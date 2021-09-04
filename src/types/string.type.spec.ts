import { StringType } from '.';

describe('StringType', () => {
  describe('successfully parses', () => {
    describe('strings', () => {
      it('"some string"', () => {
        const result = (new StringType()).parse('some string');
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe('some string');
        }
      });

      it('empty string', () => {
        const result = (new StringType()).parse('');
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe('');
        }
      });
    });

    describe('integers', () => {
      it('5', () => {
        const result = (new StringType()).parse(5);
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe('5');
        }
      });

      it('Number.MAX_SAFE_INTEGER.', () => {
        const result = (new StringType()).parse(Number.MAX_SAFE_INTEGER);
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(String(Number.MAX_SAFE_INTEGER));
        }
      });
    });

    describe('floats', () => {
      it('3.14159', () => {
        const result = (new StringType()).parse(3.14159);
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe('3.14159');
        }
      });

      it('10e9 -> 10000000000', () => {
        const result = (new StringType()).parse(10e9);
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe('10000000000');
        }
      });
    });

    describe('booleans', () => {
      it('true', () => {
        const result = (new StringType()).parse(true);
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe('true');
        }
      });

      it('false', () => {
        const result = (new StringType()).parse(false);
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe('false');
        }
      });
    });

    describe('bigints', () => {
      it('BigInt(999_999_999_999)', () => {
        const result = (new StringType()).parse(BigInt(999_999_999_999));
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe('999999999999');
        }
      });

      it('BigInt(Number.MAX_SAFE_INTEGER)', () => {
        const result = (new StringType()).parse(BigInt(Number.MAX_SAFE_INTEGER));
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(String(Number.MAX_SAFE_INTEGER));
        }
      });
    });
  });

  describe('fails to parse', () => {
    describe('functions', () => {
      it('new Function()', () => {
        const result = (new StringType()).parse(new Function());
        expect(result.isSuccessful).toBe(false);
      });
      it('function() {}', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const result = (new StringType()).parse(function() {});
        expect(result.isSuccessful).toBe(false);
      });
    });

    describe('objects', () => {
      it('{}', () => {
        const result = (new StringType()).parse({});
        expect(result.isSuccessful).toBe(false);
      });
      it('Object', () => {
        const result = (new StringType()).parse(Object);
        expect(result.isSuccessful).toBe(false);
      });
      it('Function', () => {
        const result = (new StringType()).parse(Function);
        expect(result.isSuccessful).toBe(false);
      });
    });

    describe('arrays', () => {
      it('[]', () => {
        const result = (new StringType()).parse([]);
        expect(result.isSuccessful).toBe(false);
      });
      it('[1, 2, 3]', () => {
        const result = (new StringType()).parse([1, 2, 3,]);
        expect(result.isSuccessful).toBe(false);
      });
    });
  });
});
