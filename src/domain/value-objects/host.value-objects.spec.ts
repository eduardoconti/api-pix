import { ArgumentInvalidException } from '@domain/exceptions';

import { Host } from './host.value-object';

describe('Host', () => {
  describe('constructor', () => {
    it('should create a new Host object', async () => {
      const host = new Host('http://localhost:3005/pix');
      expect(host).toBeDefined();
      expect(host.value).toBeDefined();
      expect(Host.isValueObject(host)).toBeTruthy;
    });
  });
  describe('validate', () => {
    it('should throw ArgumentInvalidException if host is invalid', () => {
      expect(() => {
        new Host('ftp\\//invalid;com');
      }).toThrowError(ArgumentInvalidException);
      expect(() => {
        new Host('http://');
      }).toThrowError(ArgumentInvalidException);
      expect(() => {
        new Host('hggps:///kkk.teste.com');
      }).toThrowError(ArgumentInvalidException);
      expect(() => {
        new Host('');
      }).toThrowError(ArgumentInvalidException);
    });
  });
});
