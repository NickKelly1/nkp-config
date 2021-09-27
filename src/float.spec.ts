import { FloatType, float } from './float';

describe('FloatType', () => {
  describe('successfully parses', () => {
    describe('floats', () => {
      it('"3.14159"', () => {
        const result = (new FloatType()).tryParse(3.14159);
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) { expect (result.value).toBe(3.14159); }
      });
    });

    describe('integers', () => {
      it('"Number.MAX_SAFE_INTEGER"', () => {
        const result = (new FloatType()).tryParse(Number.MAX_SAFE_INTEGER);
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(Number.MAX_SAFE_INTEGER);
        }
      });
    });

    describe('bigints', () => {
      it('"BigInt(Number.MAX_SAFE_INTEGER)"', () => {
        const result = (new FloatType()).tryParse(BigInt(Number.MAX_SAFE_INTEGER));
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(Number.MAX_SAFE_INTEGER);
        }
      });
    });

    describe('float strings', () => {
      it('"-9999.123"', () => {
        const result = (new FloatType()).tryParse('-9999.123');
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(-9999.123);
        }
      });
      it('"10e17"', () => {
        const result = (new FloatType()).tryParse('10e17');
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(10e17);
        }
      });
      it('String(Number.MAX_SAFE_INTEGER)', () => {
        const result = (new FloatType()).tryParse(String(Number.MAX_SAFE_INTEGER));
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(Number.MAX_SAFE_INTEGER);
        }
      });
    });
  });

  describe('fails to parse', () => {
    describe('non-float strings', () => {
      it('"non-numeric"', () => {
        const result = (new FloatType()).tryParse('not-numeric');
        expect(result.isSuccessful).toBe(false);
      });
      it('"123.e"', () => {
        const result = (new FloatType()).tryParse('123.e');
        expect(result.isSuccessful).toBe(false);
      });
    });

    describe('booleans', () => {
      it('"true"', () => {
        const result = (new FloatType()).tryParse(true);
        expect(result.isSuccessful).toBe(false);
      });
      it('"false"', () => {
        const result = (new FloatType()).tryParse(false);
        expect(result.isSuccessful).toBe(false);
      });
    });

    describe('objects', () => {
      it('"{}"', () => {
        const result = (new FloatType()).tryParse({});
        expect(result.isSuccessful).toBe(false);
      });
      it('"{ number: 5 }"', () => {
        const result = (new FloatType()).tryParse({ number: 5, });
        expect(result.isSuccessful).toBe(false);
      });
      it('"[]"', () => {
        const result = (new FloatType()).tryParse([]);
        expect(result.isSuccessful).toBe(false);
      });
      it('"new Map()"', () => {
        const result = (new FloatType()).tryParse(new Map());
        expect(result.isSuccessful).toBe(false);
      });
      it('"new Set()"', () => {
        const result = (new FloatType()).tryParse(new Set());
        expect(result.isSuccessful).toBe(false);
      });
    });

    it('"null"', () => {
      const result = (new FloatType()).tryParse(null);
      expect(result.isSuccessful).toBe(false);
    });

    it('"undefined"', () => {
      const result = (new FloatType()).tryParse(undefined);
      expect(result.isSuccessful).toBe(false);
    });
  });
});

describe('float factory', () => {
  it('creates a FloatType', () => {
    expect(float()).toBeInstanceOf(FloatType);
  });
});
