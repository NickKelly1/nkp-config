import { UnionType, IntegerType, BooleanType } from '.';

describe('UnionType', () => {
  describe('joins two types', () => {
    const integerType = new IntegerType();
    const booleanType = new BooleanType();
    const unionType = new UnionType(integerType, booleanType);
    describe('Union of (IntegerType | BooleanType)', () => {
      describe('parses integer-y values', () => {
        it('-1', () => {
          const result = unionType.parse(-1);
          expect(result.isSuccessful).toBe(true);
          if (result.isSuccessful) {
            expect(result.value).toBe(-1);
          }
        });
        it('2', () => {
          const result = unionType.parse(2);
          expect(result.isSuccessful).toBe(true);
          if (result.isSuccessful) {
            expect(result.value).toBe(2);
          }
        });
        it('"2"', () => {
          const result = unionType.parse('2');
          expect(result.isSuccessful).toBe(true);
          if (result.isSuccessful) {
            expect(result.value).toBe(2);
          }
        });
        it('String(Number.MAX_SAFE_INTEGER)', () => {
          const result = unionType.parse(String(Number.MAX_SAFE_INTEGER));
          expect(result.isSuccessful).toBe(true);
          if (result.isSuccessful) {
            expect(result.value).toBe(Number.MAX_SAFE_INTEGER);
          }
        });
      });

      describe('parses boolean-y values', () => {
        it('true', () => {
          const result = unionType.parse(true);
          expect(result.isSuccessful).toBe(true);
          if (result.isSuccessful) {
            expect(result.value).toBe(true);
          }
        });
        it('false', () => {
          const result = unionType.parse(false);
          expect(result.isSuccessful).toBe(true);
          if (result.isSuccessful) {
            expect(result.value).toBe(false);
          }
        });
        it('"true"', () => {
          const result = unionType.parse('true');
          expect(result.isSuccessful).toBe(true);
          if (result.isSuccessful) {
            expect(result.value).toBe(true);
          }
        });
        it('"false"', () => {
          const result = unionType.parse('false');
          expect(result.isSuccessful).toBe(true);
          if (result.isSuccessful) {
            expect(result.value).toBe(false);
          }
        });
      });

      describe('preferences by argument order', () => {
        it('BooleanType interprets 0 as false', () => {
          const result = booleanType.parse(0);
          expect(result.isSuccessful).toBe(true);
          if (result.isSuccessful) {
            expect(result.value).toBe(false);
          }
        });
        it('BooleanType interprets 1 as true', () => {
          const result = booleanType.parse(1);
          expect(result.isSuccessful).toBe(true);
          if (result.isSuccessful) {
            expect(result.value).toBe(true);
          }
        });
        describe('FloatType parses has precedence over BooleanType', () => {
          it('0', () => {
            const result = unionType.parse(0);
            expect(result.isSuccessful).toBe(true);
            if (result.isSuccessful) {
              expect(result.value).toBe(0);
            }
          });
          it('1', () => {
            const result = unionType.parse(1);
            expect(result.isSuccessful).toBe(true);
            if (result.isSuccessful) {
              expect(result.value).toBe(1);
            }
          });
        });
      });

      describe('fails to parse non-integer-y non-boolean-y values', () => {
        it('-1.01', () => {
          const result = unionType.parse(-1.01);
          expect(result.isSuccessful).toBe(false);
        });
        it('"truthy"', () => {
          const result = unionType.parse('truthy');
          expect(result.isSuccessful).toBe(false);
        });
        it('"0.01"', () => {
          const result = unionType.parse('0.01');
          expect(result.isSuccessful).toBe(false);
        });
      });
    });
  });
});
