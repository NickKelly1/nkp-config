import { boolean, BooleanType } from './boolean';
import { Parse } from './parse';

describe('BooleanType', () => {
  describe('on booleans', () => {
    it('parses "true"', () => {
      const result = (new BooleanType()).tryParse(true);
      expect(Parse.isSuccess(result)).toBe(true);
      if (Parse.isSuccess(result)) { expect (result.value).toBe(true); }
    });

    it('parses "false"', () => {
      const result = (new BooleanType()).tryParse(false);
      expect(Parse.isSuccess(result)).toBe(true);
      if (Parse.isSuccess(result)) { expect (result.value).toBe(false); }
    });
  });

  describe('on strings', () => {
    it('parses "true"', () => {
      const result = (new BooleanType()).tryParse('true');
      expect(Parse.isSuccess(result)).toBe(true);
      if (Parse.isSuccess(result)) { expect (result.value).toBe(true); }
    });

    it('parses "false"', () => {
      const result = (new BooleanType()).tryParse('false');
      expect(Parse.isSuccess(result)).toBe(true);
      if (Parse.isSuccess(result)) { expect (result.value).toBe(false); }
    });

    it('parses "1"', () => {
      const result = (new BooleanType()).tryParse('1');
      expect(Parse.isSuccess(result)).toBe(true);
      if (Parse.isSuccess(result)) { expect (result.value).toBe(true); }
    });

    it('parses "0"', () => {
      const result = (new BooleanType()).tryParse('0');
      expect(Parse.isSuccess(result)).toBe(true);
      if (Parse.isSuccess(result)) { expect (result.value).toBe(false); }
    });

    describe('is case insensitive', () => {
      it('on "TrUe"', () => {
        const result = (new BooleanType()).tryParse('TrUe');
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) { expect (result.value).toBe(true); }
      });

      it('on "FaLsE"', () => {
        const result = (new BooleanType()).tryParse('FaLsE');
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) { expect (result.value).toBe(false); }
      });
    });

    describe('trims whitespace', () => {
      it('on "tRuE"', () => {
        const result = (new BooleanType()).tryParse('   tRuE\n');
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) { expect (result.value).toBe(true); }
      });

      it('on "fAlSe"', () => {
        const result = (new BooleanType()).tryParse('\n\n fAlSe\n');
        expect(Parse.isSuccess(result)).toBe(true);
        if (Parse.isSuccess(result)) { expect (result.value).toBe(false); }
      });
    });

    it('fails to parse non-boolean-like values', () => {
      const result1 = (new BooleanType()).tryParse('falsee');
      const result2 = (new BooleanType()).tryParse('ffalse');
      const result3 = (new BooleanType()).tryParse('truee');
      const result4 = (new BooleanType()).tryParse('ttrue');
      const result5 = (new BooleanType()).tryParse('');
      expect(Parse.isSuccess(result1)).toBe(false);
      expect(Parse.isSuccess(result2)).toBe(false);
      expect(Parse.isSuccess(result3)).toBe(false);
      expect(Parse.isSuccess(result4)).toBe(false);
      expect(Parse.isSuccess(result5)).toBe(false);
    });
  });


  describe('on numbers', () => {
    it('parses 1 as "true"', () => {
      const result = (new BooleanType()).tryParse(1);
      expect(Parse.isSuccess(result)).toBe(true);
      if (Parse.isSuccess(result)) { expect (result.value).toBe(true); }
    });

    it('parses 0 as "false"', () => {
      const result = (new BooleanType()).tryParse(0);
      expect(Parse.isSuccess(result)).toBe(true);
      if (Parse.isSuccess(result)) { expect (result.value).toBe(false); }
    });

    it('fails to parse non-0 and non-1 numbers', () => {
      const result1 = (new BooleanType()).tryParse(1.01);
      const result2 = (new BooleanType()).tryParse(0.99);
      const result3 = (new BooleanType()).tryParse(0.1);
      const result4 = (new BooleanType()).tryParse(-0.1);
      const result5 = (new BooleanType()).tryParse(-0.99);
      const result6 = (new BooleanType()).tryParse(-1.01);
      expect(Parse.isSuccess(result1)).toBe(false);
      expect(Parse.isSuccess(result2)).toBe(false);
      expect(Parse.isSuccess(result3)).toBe(false);
      expect(Parse.isSuccess(result4)).toBe(false);
      expect(Parse.isSuccess(result5)).toBe(false);
      expect(Parse.isSuccess(result6)).toBe(false);
    });
  });

  describe('on bigints', () => {
    it('parses BigInt(1) as "true"', () => {
      const result = (new BooleanType()).tryParse(BigInt(1));
      expect(Parse.isSuccess(result)).toBe(true);
      if (Parse.isSuccess(result)) { expect (result.value).toBe(true); }
    });

    it('parses BigInt(0) as "false"', () => {
      const result = (new BooleanType()).tryParse(BigInt(0));
      expect(Parse.isSuccess(result)).toBe(true);
      if (Parse.isSuccess(result)) { expect (result.value).toBe(false); }
    });

    it('fails to parse non-BigInt(0) and non-BigInt(1) BigInts', () => {
      const result1 = (new BooleanType()).tryParse(BigInt(50000000000000000));
      const result2 = (new BooleanType()).tryParse(BigInt(50000000000));
      const result3 = (new BooleanType()).tryParse(BigInt(500));
      const result4 = (new BooleanType()).tryParse(BigInt(-1));
      const result5 = (new BooleanType()).tryParse(BigInt(-500));
      const result6 = (new BooleanType()).tryParse(BigInt(-50000000000));
      const result7 = (new BooleanType()).tryParse(BigInt(-50000000000000000));
      expect(Parse.isSuccess(result1)).toBe(false);
      expect(Parse.isSuccess(result2)).toBe(false);
      expect(Parse.isSuccess(result3)).toBe(false);
      expect(Parse.isSuccess(result4)).toBe(false);
      expect(Parse.isSuccess(result5)).toBe(false);
      expect(Parse.isSuccess(result6)).toBe(false);
      expect(Parse.isSuccess(result7)).toBe(false);
    });
  });

  describe('on null', () => {
    it('fails to parse', () => {
      const result = (new BooleanType()).tryParse(null);
      expect(Parse.isSuccess(result)).toBe(false);
    });
  });

  describe('on undefined', () => {
    it('fails to parse', () => {
      const result = (new BooleanType()).tryParse(undefined);
      expect(Parse.isSuccess(result)).toBe(false);
    });
  });
});

describe('boolean factory', () => {
  it('creates a BooleanType', () => {
    expect(boolean()).toBeInstanceOf(BooleanType);
  });
});
