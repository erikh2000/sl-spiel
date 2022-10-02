import {calcMeanAverage, findMax, removeEmptyElements} from '../arrayUtil';

describe('arrayUtil', () => {
  describe('removeEmptyElements', () => {
    it('returns null for empty array', () => {
      const array:number[] = [];
      const expected = null;
      const removed = removeEmptyElements(array);
      expect(removed).toEqual(expected);
    });

    it('returns null for numeric array with no empty elements', () => {
      const array = [0,1,2,3];
      const expected = null;
      const removed = removeEmptyElements(array);
      expect(removed).toEqual(expected);
    });

    it('returns null for string array with no empty elements', () => {
      const array = ['','a','b','c'];
      const expected = null;
      const removed = removeEmptyElements(array);
      expect(removed).toEqual(expected);
    });
    
    it('returns null for object array with no empty elements', () => {
      const array = [{},{x:null},{x:3}];
      const expected = null;
      const removed = removeEmptyElements(array);
      expect(removed).toEqual(expected);
    });

    it('returns null for array array with no empty elements', () => {
      const array = [[],[1,2,3],['a','b','c']];
      const expected = null;
      const removed = removeEmptyElements(array);
      expect(removed).toEqual(expected);
    });

    it('returns filtered numeric array with one empty element', () => {
      const array = [0,1,2,undefined,3];
      const expected = [0,1,2,3];
      const removed = removeEmptyElements(array);
      expect(removed).toEqual(expected);
    });

    it('returns filtered string array with one empty element', () => {
      const array = ['a','b',undefined,'c'];
      const expected = ['a','b','c'];
      const removed = removeEmptyElements(array);
      expect(removed).toEqual(expected);
    });

    it('returns filtered object array with one empty element', () => {
      const array = [{},{x:null},undefined,{x:3}];
      const expected = [{},{x:null},{x:3}];
      const removed = removeEmptyElements(array);
      expect(removed).toEqual(expected);
    });

    it('returns filtered array array with one empty element', () => {
      const array = [[],[1,2,3],undefined,['a','b','c']];
      const expected = [[],[1,2,3],['a','b','c']];
      const removed = removeEmptyElements(array);
      expect(removed).toEqual(expected);
    });

    it('filters nulls', () => {
      const array = [0,1,2,null,3];
      const expected = [0,1,2,3];
      const removed = removeEmptyElements(array);
      expect(removed).toEqual(expected);
    });

    it('filters multiple empty elements', () => {
      const array = [0,undefined,1,2,null,3,null];
      const expected = [0,1,2,3];
      const removed = removeEmptyElements(array);
      expect(removed).toEqual(expected);
    });
    
    it('returns empty array when passed a non-array', () => {
      const array = undefined as unknown;
      const expected:Array<any> = [];
      const removed = removeEmptyElements(array as Array<any>);
      expect(removed).toEqual(expected);
    });
  });
  
  describe('findMax()', () => {
    it('returns -infinity when passed an empty array', () => {
      const array:number[] = [];
      const expected = -Infinity;
      expect(findMax(array)).toEqual(expected);
    });

    it('returns max value within an array', () => {
      const array:number[] = [1, 2, 5, 3, 4, 6, 1, -5];
      const expected = 6;
      expect(findMax(array)).toEqual(expected);
    });
  });
  
  describe('calcMeanAverage()', () => {
    it('returns 0 for empty array', () => {
      const array:number[] = [];
      const expected = 0;
      expect(calcMeanAverage(array)).toEqual(expected);
    });

    it('returns value for single-value array', () => {
      const array = [3];
      const expected = 3;
      expect(calcMeanAverage(array)).toEqual(expected);
    });

    it('returns average for multi-value array', () => {
      const array = [2,4];
      const expected = 3;
      expect(calcMeanAverage(array)).toEqual(expected);
    });
  });
});