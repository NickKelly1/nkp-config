import { IntegerType, integer } from './integer';

describe('IntegerType', () => {
  describe('successfully parses', () => {
    describe('integers', () => {
      it('"0"', () => {
        const result = (new IntegerType()).tryParse(0);
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(0);
        }
      });
      it('"-0"', () => {
        const result = (new IntegerType()).tryParse(-0);
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(-0);
        }
      });
      it('"-100"', () => {
        const result = (new IntegerType()).tryParse(-100);
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(-100);
        }
      });
      it('"-100.000000"', () => {
        const result = (new IntegerType()).tryParse(-100.000000);
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(-100.000000);
        }
      });
      it('"Number.MAX_SAFE_INTEGER"', () => {
        const result = (new IntegerType()).tryParse(Number.MAX_SAFE_INTEGER);
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(Number.MAX_SAFE_INTEGER);
        }
      });
    });

    describe('bigints', () => {
      it('"BigInt(Number.MAX_SAFE_INTEGER)"', () => {
        const result = (new IntegerType()).tryParse(BigInt(Number.MAX_SAFE_INTEGER));
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(Number.MAX_SAFE_INTEGER);
        }
      });
    });

    describe('float strings', () => {
      it('"-9999.000"', () => {
        const result = (new IntegerType()).tryParse('-9999.000');
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(-9999.000);
        }
      });
      it('"10e5"', () => {
        const result = (new IntegerType()).tryParse('10e5');
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(10e5);
        }
      });
      it('String(Number.MAX_SAFE_INTEGER)', () => {
        const result = (new IntegerType()).tryParse(String(Number.MAX_SAFE_INTEGER));
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(Number.MAX_SAFE_INTEGER);
        }
      });
    });
  });

  describe('fails to parse', () => {
    describe('non-integer strings', () => {
      it('"1.001"', () => {
        const result = (new IntegerType()).tryParse('1.001');
        expect(result.isSuccessful).toBe(false);
      });
      it('"123.e"', () => {
        const result = (new IntegerType()).tryParse('123.e');
        expect(result.isSuccessful).toBe(false);
      });
    });

    describe('booleans', () => {
      it('"true"', () => {
        const result = (new IntegerType()).tryParse(true);
        expect(result.isSuccessful).toBe(false);
      });
      it('"false"', () => {
        const result = (new IntegerType()).tryParse(false);
        expect(result.isSuccessful).toBe(false);
      });
    });

    describe('objects', () => {
      it('"{}"', () => {
        const result = (new IntegerType()).tryParse({});
        expect(result.isSuccessful).toBe(false);
      });
      it('"{ number: 5 }"', () => {
        const result = (new IntegerType()).tryParse({ number: 5, });
        expect(result.isSuccessful).toBe(false);
      });
      it('"[]"', () => {
        const result = (new IntegerType()).tryParse([]);
        expect(result.isSuccessful).toBe(false);
      });
      it('"new Map()"', () => {
        const result = (new IntegerType()).tryParse(new Map());
        expect(result.isSuccessful).toBe(false);
      });
      it('"new Set()"', () => {
        const result = (new IntegerType()).tryParse(new Set());
        expect(result.isSuccessful).toBe(false);
      });
    });

    it('"null"', () => {
      const result = (new IntegerType()).tryParse(null);
      expect(result.isSuccessful).toBe(false);
    });

    it('"undefined"', () => {
      const result = (new IntegerType()).tryParse(undefined);
      expect(result.isSuccessful).toBe(false);
    });
  });
});


describe('integer factory', () => {
  it('creates an IntegerType', () => {
    expect(integer()).toBeInstanceOf(IntegerType);
  });
});
