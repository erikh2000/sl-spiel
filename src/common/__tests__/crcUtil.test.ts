import { calcCrc } from "../crcUtil";

describe('crcUtil', () => {
  describe('calcCrc()', () => {
    it('returns ffff for an empty byte array', () => {
      const bytes:Uint8Array = new Uint8Array([]);
      const expected = 'ffff';
      expect(calcCrc(bytes)).toEqual(expected);
    });

    it('returns same checksum for same byte array passed twice', () => {
      const bytes:Uint8Array = new Uint8Array([0,1,2,3,4,5,6,7,8,9]);
      const expected = calcCrc(bytes);
      expect(calcCrc(bytes)).toEqual(expected);
    });

    it('returns different checksums for 100 different byte arrays', () => {
      const crcsSoFar:string[] = [];
      for(let i = 0; i < 100; ++i) {
        const bytes:Uint8Array = new Uint8Array([i,i,i,i,i,i,i,i,i,i,i]);
        const crc = calcCrc(bytes);
        expect(!crcsSoFar.includes(crc)).toBeTruthy();
        crcsSoFar.push(crc);
      }
    });

    it('returns same checksum for 2 500-byte arrays with same values', () => {
      const bytes1:Uint8Array = new Uint8Array(500);
      const bytes2:Uint8Array = new Uint8Array(500);
      for(let i = 0; i < 500; ++i) {
        bytes1[i] = i;
        bytes2[i] = i;
      }
      const crc1 = calcCrc(bytes1);
      const crc2 = calcCrc(bytes2);
      expect(crc1).toEqual(crc2);
    });

    it('returns different checksums for 2 500-byte arrays with different values', () => {
      const bytes1:Uint8Array = new Uint8Array(500);
      const bytes2:Uint8Array = new Uint8Array(500);
      for(let i = 0; i < 500; ++i) {
        bytes1[i] = i;
        bytes2[i] = i;
      }
      bytes2[499] = 0;
      const crc1 = calcCrc(bytes1);
      const crc2 = calcCrc(bytes2);
      expect(crc1).not.toEqual(crc2);
    });
  });
});