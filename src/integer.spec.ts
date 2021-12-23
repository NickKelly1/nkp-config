import { IntegerType, integer } from './integer';
import { Parse } from './parse';

describe('IntegerType', () => {
  describe('successfully parses', () => {
    describe('integers', () => {
      it('"0"', () => {
        const result = (new IntegerType()).tryParse(0);
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) {
          expect (result.value).toBe(0);
        }
      });
      it('"-0"', () => {
        const result = (new IntegerType()).tryParse(-0);
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) {
          expect (result.value).toBe(-0);
        }
      });
      it('"-100"', () => {
        const result = (new IntegerType()).tryParse(-100);
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) {
          expect (result.value).toBe(-100);
        }
      });
      it('"-100.000000"', () => {
        const result = (new IntegerType()).tryParse(-100.000000);
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) {
          expect (result.value).toBe(-100.000000);
        }
      });
      it('"Number.MAX_SAFE_INTEGER"', () => {
        const result = (new IntegerType()).tryParse(Number.MAX_SAFE_INTEGER);
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) {
          expect (result.value).toBe(Number.MAX_SAFE_INTEGER);
        }
      });
    });

    describe('bigints', () => {
      it('"BigInt(Number.MAX_SAFE_INTEGER)"', () => {
        const result = (new IntegerType()).tryParse(BigInt(Number.MAX_SAFE_INTEGER));
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) {
          expect (result.value).toBe(Number.MAX_SAFE_INTEGER);
        }
      });
    });

    describe('float strings', () => {
      it('"-9999.000"', () => {
        const result = (new IntegerType()).tryParse('-9999.000');
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) {
          expect (result.value).toBe(-9999.000);
        }
      });
      it('"10e5"', () => {
        const result = (new IntegerType()).tryParse('10e5');
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) {
          expect (result.value).toBe(10e5);
        }
      });
      it('String(Number.MAX_SAFE_INTEGER)', () => {
        const result = (new IntegerType()).tryParse(String(Number.MAX_SAFE_INTEGER));
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) {
          expect (result.value).toBe(Number.MAX_SAFE_INTEGER);
        }
      });
    });
  });

  describe('fails to parse', () => {
    describe('non-integer strings', () => {
      it('"1.001"', () => {
        const result = (new IntegerType()).tryParse('1.001');
        expect(Parse.isSuccess(result)).toBe(false);
      });
      it('"123.e"', () => {
        const result = (new IntegerType()).tryParse('123.e');
        expect(Parse.isSuccess(result)).toBe(false);
      });
    });

    describe('booleans', () => {
      it('"true"', () => {
        const result = (new IntegerType()).tryParse(true);
        expect(Parse.isSuccess(result)).toBe(false);
      });
      it('"false"', () => {
        const result = (new IntegerType()).tryParse(false);
        expect(Parse.isSuccess(result)).toBe(false);
      });
    });

    describe('objects', () => {
      it('"{}"', () => {
        const result = (new IntegerType()).tryParse({});
        expect(Parse.isSuccess(result)).toBe(false);
      });
      it('"{ number: 5 }"', () => {
        const result = (new IntegerType()).tryParse({ number: 5, });
        expect(Parse.isSuccess(result)).toBe(false);
      });
      it('"[]"', () => {
        const result = (new IntegerType()).tryParse([]);
        expect(Parse.isSuccess(result)).toBe(false);
      });
      it('"new Map()"', () => {
        const result = (new IntegerType()).tryParse(new Map());
        expect(Parse.isSuccess(result)).toBe(false);
      });
      it('"new Set()"', () => {
        const result = (new IntegerType()).tryParse(new Set());
        expect(Parse.isSuccess(result)).toBe(false);
      });
    });

    it('"null"', () => {
      const result = (new IntegerType()).tryParse(null);
      expect(Parse.isSuccess(result)).toBe(false);
    });

    it('"undefined"', () => {
      const result = (new IntegerType()).tryParse(undefined);
      expect(Parse.isSuccess(result)).toBe(false);
    });
  });
});


describe('integer factory', () => {
  it('creates an IntegerType', () => {
    expect(integer()).toBeInstanceOf(IntegerType);
  });
});
