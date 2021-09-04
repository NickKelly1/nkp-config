import { FloatType } from '.';

describe('FloatType', () => {
  describe('successfully parses', () => {
    describe('floats', () => {
      it('"3.14159"', () => {
        const result = (new FloatType()).parse(3.14159);
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) { expect (result.value).toBe(3.14159); }
      });
    });

    describe('integers', () => {
      it('"Number.MAX_SAFE_INTEGER"', () => {
        const result = (new FloatType()).parse(Number.MAX_SAFE_INTEGER);
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(Number.MAX_SAFE_INTEGER);
        }
      });
    });

    describe('bigints', () => {
      it('"BigInt(Number.MAX_SAFE_INTEGER)"', () => {
        const result = (new FloatType()).parse(BigInt(Number.MAX_SAFE_INTEGER));
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(Number.MAX_SAFE_INTEGER);
        }
      });
    });

    describe('float strings', () => {
      it('"-9999.123"', () => {
        const result = (new FloatType()).parse('-9999.123');
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(-9999.123);
        }
      });
      it('"10e17"', () => {
        const result = (new FloatType()).parse('10e17');
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(10e17);
        }
      });
      it('String(Number.MAX_SAFE_INTEGER)', () => {
        const result = (new FloatType()).parse(String(Number.MAX_SAFE_INTEGER));
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
        const result = (new FloatType()).parse('not-numeric');
        expect(result.isSuccessful).toBe(false);
      });
      it('"123.e"', () => {
        const result = (new FloatType()).parse('123.e');
        expect(result.isSuccessful).toBe(false);
      });
    });

    describe('booleans', () => {
      it('"true"', () => {
        const result = (new FloatType()).parse(true);
        expect(result.isSuccessful).toBe(false);
      });
      it('"false"', () => {
        const result = (new FloatType()).parse(false);
        expect(result.isSuccessful).toBe(false);
      });
    });

    describe('objects', () => {
      it('"{}"', () => {
        const result = (new FloatType()).parse({});
        expect(result.isSuccessful).toBe(false);
      });
      it('"{ number: 5 }"', () => {
        const result = (new FloatType()).parse({ number: 5, });
        expect(result.isSuccessful).toBe(false);
      });
      it('"[]"', () => {
        const result = (new FloatType()).parse([]);
        expect(result.isSuccessful).toBe(false);
      });
      it('"new Map()"', () => {
        const result = (new FloatType()).parse(new Map());
        expect(result.isSuccessful).toBe(false);
      });
      it('"new Set()"', () => {
        const result = (new FloatType()).parse(new Set());
        expect(result.isSuccessful).toBe(false);
      });
    });

    it('"null"', () => {
      const result = (new FloatType()).parse(null);
      expect(result.isSuccessful).toBe(false);
    });

    it('"undefined"', () => {
      const result = (new FloatType()).parse(undefined);
      expect(result.isSuccessful).toBe(false);
    });
  });
});
