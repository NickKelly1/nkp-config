import { IntegerType } from '.';

describe('IntegerType', () => {
  describe('successfully parses', () => {
    describe('integers', () => {
      it('"0"', () => {
        const result = (new IntegerType()).parse(0);
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(0);
        }
      });
      it('"-0"', () => {
        const result = (new IntegerType()).parse(-0);
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(-0);
        }
      });
      it('"-100"', () => {
        const result = (new IntegerType()).parse(-100);
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(-100);
        }
      });
      it('"-100.000000"', () => {
        const result = (new IntegerType()).parse(-100.000000);
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(-100.000000);
        }
      });
      it('"Number.MAX_SAFE_INTEGER"', () => {
        const result = (new IntegerType()).parse(Number.MAX_SAFE_INTEGER);
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(Number.MAX_SAFE_INTEGER);
        }
      });
    });

    describe('bigints', () => {
      it('"BigInt(Number.MAX_SAFE_INTEGER)"', () => {
        const result = (new IntegerType()).parse(BigInt(Number.MAX_SAFE_INTEGER));
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(Number.MAX_SAFE_INTEGER);
        }
      });
    });

    describe('float strings', () => {
      it('"-9999.000"', () => {
        const result = (new IntegerType()).parse('-9999.000');
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(-9999.000);
        }
      });
      it('"10e5"', () => {
        const result = (new IntegerType()).parse('10e5');
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) {
          expect (result.value).toBe(10e5);
        }
      });
      it('String(Number.MAX_SAFE_INTEGER)', () => {
        const result = (new IntegerType()).parse(String(Number.MAX_SAFE_INTEGER));
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
        const result = (new IntegerType()).parse('1.001');
        expect(result.isSuccessful).toBe(false);
      });
      it('"123.e"', () => {
        const result = (new IntegerType()).parse('123.e');
        expect(result.isSuccessful).toBe(false);
      });
    });

    describe('booleans', () => {
      it('"true"', () => {
        const result = (new IntegerType()).parse(true);
        expect(result.isSuccessful).toBe(false);
      });
      it('"false"', () => {
        const result = (new IntegerType()).parse(false);
        expect(result.isSuccessful).toBe(false);
      });
    });

    describe('objects', () => {
      it('"{}"', () => {
        const result = (new IntegerType()).parse({});
        expect(result.isSuccessful).toBe(false);
      });
      it('"{ number: 5 }"', () => {
        const result = (new IntegerType()).parse({ number: 5, });
        expect(result.isSuccessful).toBe(false);
      });
      it('"[]"', () => {
        const result = (new IntegerType()).parse([]);
        expect(result.isSuccessful).toBe(false);
      });
      it('"new Map()"', () => {
        const result = (new IntegerType()).parse(new Map());
        expect(result.isSuccessful).toBe(false);
      });
      it('"new Set()"', () => {
        const result = (new IntegerType()).parse(new Set());
        expect(result.isSuccessful).toBe(false);
      });
    });

    it('"null"', () => {
      const result = (new IntegerType()).parse(null);
      expect(result.isSuccessful).toBe(false);
    });

    it('"undefined"', () => {
      const result = (new IntegerType()).parse(undefined);
      expect(result.isSuccessful).toBe(false);
    });
  });
});
