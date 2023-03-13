import { ArgumentInvalidException } from '@domain/exceptions';

import { Password } from './password.value-object';

describe('Password', () => {
  describe('constructor', () => {
    it('should create a new Password object', async () => {
      const password = new Password('Eduardo Conti');
      expect(password).toBeDefined();
      expect(password.value).toBeDefined();
      expect(Password.isValueObject(password)).toBeTruthy;
    });
  });
  describe('validate', () => {
    it('should throw ArgumentInvalidException if password is null', () => {
      expect(() => {
        new Password('');
      }).toThrowError(ArgumentInvalidException);
    });
  });
});
