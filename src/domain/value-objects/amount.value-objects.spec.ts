import { ArgumentInvalidException } from '@domain/exceptions';

import { Amount } from './amount.value-object';

describe('Amount', () => {
  describe('constructor', () => {
    it('should create a new Amount object', () => {
      const amount = new Amount(100);
      expect(amount).toBeDefined();
      expect(amount.value).toBe(100);
      expect(amount.equals(amount)).toBeTruthy();
    });
  });

  describe('toBrlString', () => {
    it('should convert the value to a Brazilian currency string', () => {
      const amount = new Amount(12345);
      expect(amount.toBrlString()).toBe('123.45');
    });
  });

  describe('fromBrlString', () => {
    it('should convert a Brazilian currency string to a number', () => {
      const amount = Amount.fromBrlString('123.45');
      expect(amount).toBe(12345);
    });
  });

  describe('validate', () => {
    it('should throw an exception if the value is not a positive integer', () => {
      expect(() => {
        new Amount(-100);
      }).toThrowError(ArgumentInvalidException);
      expect(() => {
        new Amount(123.45);
      }).toThrowError(ArgumentInvalidException);
      expect(() => {
        new Amount(NaN);
      }).toThrowError(ArgumentInvalidException);
    });
  });
});
