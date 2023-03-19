import { ArgumentInvalidException } from '@domain/exceptions';

import { UUID } from './uuid.value-object';

describe('UUID', () => {
  describe('constructor', () => {
    it('should create a new UUID object', async () => {
      const uuid = new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d');
      expect(uuid).toBeDefined();
      expect(uuid.value).toBeDefined();
      expect(UUID.isValueObject(uuid)).toBeTruthy;
    });
  });
  describe('validate', () => {
    it('should throw ArgumentInvalidException', () => {
      expect(() => {
        new UUID('fakeuuid');
      }).toThrowError(ArgumentInvalidException);
      expect(() => {
        new UUID('b85381d7174f4c0aa2c8aa93a399965d');
      }).toThrowError(ArgumentInvalidException);
    });
  });
});
