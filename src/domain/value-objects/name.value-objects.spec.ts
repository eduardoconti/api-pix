import { ArgumentInvalidException } from '@domain/exceptions';

import { Name } from './name.value-object';

describe('Name', () => {
  describe('constructor', () => {
    it('should create a new Name object', async () => {
      const name = new Name('Eduardo Conti');
      expect(name).toBeDefined();
      expect(name.value).toBeDefined();
      expect(Name.isValueObject(name)).toBeTruthy;
    });
  });
  describe('validate', () => {
    it('should throw ArgumentInvalidException if name not be greater than 2 chars', () => {
      expect(() => {
        new Name('EA');
      }).toThrowError(ArgumentInvalidException);
      expect(() => {
        new Name('');
      }).toThrowError(ArgumentInvalidException);
    });

    it('should throw ArgumentInvalidException if name not less than 100 chars', () => {
      expect(() => {
        new Name(
          'ASDDDDASDASDASDASDASDASDASDASDASASDASDASDASDADAS ASDASDADASDASDSAD ASDASDASDASDASDASD ASDDDDASDASDASDASDASDASDASD',
        );
      }).toThrowError(ArgumentInvalidException);
      expect(() => {
        new Name('');
      }).toThrowError(ArgumentInvalidException);
    });
  });
});
