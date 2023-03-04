import { ArgumentInvalidException } from '@domain/exceptions';

import { DateVO } from './date.value-object';

describe('DateVO', () => {
  describe('constructor', () => {
    it('should create a new DateVO object with a Date value', () => {
      const date = new Date();
      const dateVO = new DateVO(date);
      expect(dateVO).toBeDefined();
      expect(dateVO.value).toBeInstanceOf(Date);
      expect(dateVO.value).toEqual(date);
    });

    it('should create a new DateVO object with a string value', () => {
      const dateString = '2022-05-15T09:30:00.000Z';
      const dateVO = new DateVO(dateString);
      expect(dateVO).toBeDefined();
      expect(dateVO.value).toBeInstanceOf(Date);
      expect(dateVO.value.toISOString()).toBe(dateString);
    });

    it('should create a new DateVO object with a numeric value', () => {
      const timestamp = 1641024600000;
      const dateVO = new DateVO(timestamp);
      expect(dateVO).toBeDefined();
      expect(dateVO.value).toBeInstanceOf(Date);
      expect(dateVO.value.getTime()).toBe(timestamp);
    });

    it('should throw an exception if the value is not valid', () => {
      expect(() => {
        new DateVO('invalid date');
      }).toThrow(ArgumentInvalidException);
    });
  });

  describe('now', () => {
    it('should create a new DateVO object with the current time', () => {
      const dateVO = DateVO.now();
      expect(dateVO).toBeDefined();
      expect(dateVO.value).toBeInstanceOf(Date);
      expect(dateVO.value.getTime()).toBeCloseTo(Date.now(), -3);
    });
  });

  describe('validate', () => {
    it('should throw an exception if the value is not a valid Date object', () => {
      expect(() => {
        new DateVO(NaN);
      }).toThrow(ArgumentInvalidException);
      expect(() => {
        new DateVO('invalid date');
      }).toThrow(ArgumentInvalidException);
    });
  });
});
