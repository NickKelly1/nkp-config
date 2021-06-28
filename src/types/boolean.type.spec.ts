import { BooleanType } from '.';

describe('BooleanType', () => {
  describe('on booleans', () => {
    it('parses "true"', () => {
      const result = (new BooleanType()).parse(true);
      expect(result.isSuccessful).toBe(true);
      if (result.isSuccessful) { expect (result.value).toBe(true); }
    });

    it('parses "false"', () => {
      const result = (new BooleanType()).parse(false);
      expect(result.isSuccessful).toBe(true);
      if (result.isSuccessful) { expect (result.value).toBe(false); }
    });
  });

  describe('on strings', () => {
    it('parses "true"', () => {
      const result = (new BooleanType()).parse('true');
      expect(result.isSuccessful).toBe(true);
      if (result.isSuccessful) { expect (result.value).toBe(true); }
    });

    it('parses "false"', () => {
      const result = (new BooleanType()).parse('false');
      expect(result.isSuccessful).toBe(true);
      if (result.isSuccessful) { expect (result.value).toBe(false); }
    });

    it('parses "1"', () => {
      const result = (new BooleanType()).parse('1');
      expect(result.isSuccessful).toBe(true);
      if (result.isSuccessful) { expect (result.value).toBe(true); }
    });

    it('parses "0"', () => {
      const result = (new BooleanType()).parse('0');
      expect(result.isSuccessful).toBe(true);
      if (result.isSuccessful) { expect (result.value).toBe(false); }
    });

    describe('is case insensitive', () => {
      it('on "TrUe"', () => {
        const result = (new BooleanType()).parse('TrUe');
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) { expect (result.value).toBe(true); }
      });

      it('on "FaLsE"', () => {
        const result = (new BooleanType()).parse('FaLsE');
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) { expect (result.value).toBe(false); }
      });
    });

    describe('trims whitespace', () => {
      it('on "tRuE"', () => {
        const result = (new BooleanType()).parse('   tRuE\n');
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) { expect (result.value).toBe(true); }
      });

      it('on "fAlSe"', () => {
        const result = (new BooleanType()).parse('\n\n fAlSe\n');
        expect(result.isSuccessful).toBe(true);
        if (result.isSuccessful) { expect (result.value).toBe(false); }
      });
    });

    it('fails to parse non-boolean-like values', () => {
      const result1 = (new BooleanType()).parse('falsee');
      const result2 = (new BooleanType()).parse('ffalse');
      const result3 = (new BooleanType()).parse('truee');
      const result4 = (new BooleanType()).parse('ttrue');
      const result5 = (new BooleanType()).parse('');
      expect(result1.isSuccessful).toBe(false);
      expect(result2.isSuccessful).toBe(false);
      expect(result3.isSuccessful).toBe(false);
      expect(result4.isSuccessful).toBe(false);
      expect(result5.isSuccessful).toBe(false);
    });
  });


  describe('on numbers', () => {
    it('parses 1 as "true"', () => {
      const result = (new BooleanType()).parse(1);
      expect(result.isSuccessful).toBe(true);
      if (result.isSuccessful) { expect (result.value).toBe(true); }
    });

    it('parses 0 as "false"', () => {
      const result = (new BooleanType()).parse(0);
      expect(result.isSuccessful).toBe(true);
      if (result.isSuccessful) { expect (result.value).toBe(false); }
    });

    it('fails to parse non-0 and non-1 numbers', () => {
      const result1 = (new BooleanType()).parse(1.01);
      const result2 = (new BooleanType()).parse(0.99);
      const result3 = (new BooleanType()).parse(0.1);
      const result4 = (new BooleanType()).parse(-0.1);
      const result5 = (new BooleanType()).parse(-0.99);
      const result6 = (new BooleanType()).parse(-1.01);
      expect(result1.isSuccessful).toBe(false);
      expect(result2.isSuccessful).toBe(false);
      expect(result3.isSuccessful).toBe(false);
      expect(result4.isSuccessful).toBe(false);
      expect(result5.isSuccessful).toBe(false);
      expect(result6.isSuccessful).toBe(false);
    });
  });

  describe('on bigints', () => {
    it('parses BigInt(1) as "true"', () => {
      const result = (new BooleanType()).parse(BigInt(1));
      expect(result.isSuccessful).toBe(true);
      if (result.isSuccessful) { expect (result.value).toBe(true); }
    });

    it('parses BigInt(0) as "false"', () => {
      const result = (new BooleanType()).parse(BigInt(0));
      expect(result.isSuccessful).toBe(true);
      if (result.isSuccessful) { expect (result.value).toBe(false); }
    });

    it('fails to parse non-BigInt(0) and non-BigInt(1) BigInts', () => {
      const result1 = (new BooleanType()).parse(BigInt(50000000000000000));
      const result2 = (new BooleanType()).parse(BigInt(50000000000));
      const result3 = (new BooleanType()).parse(BigInt(500));
      const result4 = (new BooleanType()).parse(BigInt(-1));
      const result5 = (new BooleanType()).parse(BigInt(-500));
      const result6 = (new BooleanType()).parse(BigInt(-50000000000));
      const result7 = (new BooleanType()).parse(BigInt(-50000000000000000));
      expect(result1.isSuccessful).toBe(false);
      expect(result2.isSuccessful).toBe(false);
      expect(result3.isSuccessful).toBe(false);
      expect(result4.isSuccessful).toBe(false);
      expect(result5.isSuccessful).toBe(false);
      expect(result6.isSuccessful).toBe(false);
      expect(result7.isSuccessful).toBe(false);
    });
  });

  describe('on null', () => {
    it('fails to parse', () => {
      const result = (new BooleanType()).parse(null);
      expect(result.isSuccessful).toBe(false);
    });
  });

  describe('on undefined', () => {
    it('fails to parse', () => {
      const result = (new BooleanType()).parse(undefined);
      expect(result.isSuccessful).toBe(false);
    });
  });
});
