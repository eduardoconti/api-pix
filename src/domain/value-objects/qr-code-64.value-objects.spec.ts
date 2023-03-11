import { ArgumentInvalidException } from '@domain/exceptions';

import { QrCode64 } from './qr-code-64.value-object';

describe('QrCode64', () => {
  describe('constructor', () => {
    it('should create a new QrCode64 object', async () => {
      const qrCode = await QrCode64.base64(
        '00020101021226930014br.gov.bcb.pix2571api-h.developer.btgpactual.com/pc/p/v2/307aa0ef12924605b53e91ff6a9a07645204000053039865802BR5910Gazin Tech6008Marialva61088699000062070503***63044FA6',
      );
      expect(qrCode).toBeDefined();
      expect(qrCode.value).toBeDefined();
      expect(QrCode64.isValueObject(qrCode)).toBeTruthy;
    });
  });
  describe('validate', () => {
    it('should throw an exception if not match regex', () => {
      expect(() => {
        new QrCode64(
          '00020101021226930014br.gov.bcb.pix2571api-h.developer.btgpactual.com/pc/p/v2/307aa0ef',
        );
      }).toThrowError(ArgumentInvalidException);
      expect(() => {
        new QrCode64('');
      }).toThrowError(ArgumentInvalidException);
    });
  });
});
