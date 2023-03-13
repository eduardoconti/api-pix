import { ArgumentInvalidException } from '@domain/exceptions';

import { Email } from './email.value-object';

describe('Email', () => {
  describe('constructor', () => {
    it('should create a new Email object', async () => {
      const email = new Email('es.eduardoconti@gmail.com');
      expect(email).toBeDefined();
      expect(email.value).toBeDefined();
      expect(Email.isValueObject(email)).toBeTruthy;
    });
  });
  describe('validate', () => {
    it('should throw ArgumentInvalidException if email is invalid', () => {
      expect(() => {
        new Email('es.eduardoconti@gmail..com');
      }).toThrowError(ArgumentInvalidException);
      expect(() => {
        new Email('es.eduardoconti#gmail.com');
      }).toThrowError(ArgumentInvalidException);
      expect(() => {
        new Email('es.eduardoconti@gmail,com');
      }).toThrowError(ArgumentInvalidException);
      expect(() => {
        new Email('es.eduardocontigmail.com');
      }).toThrowError(ArgumentInvalidException);
      expect(() => {
        new Email('es.eduardoconti@gmailcom');
      }).toThrowError(ArgumentInvalidException);
      expect(() => {
        new Email('');
      }).toThrowError(ArgumentInvalidException);
    });
  });
});
