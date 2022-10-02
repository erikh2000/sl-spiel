// Return null if array had no empty elements, otherwise return a new array with empty elements removed.
export function removeEmptyElements(array:Array<any>):Array<any> | null {
  try {
    const _isEmpty = (value:any) => value === undefined || value === null;
    if (!array.some(_isEmpty)) return null;
    return array.filter(value => !_isEmpty(value));
  } catch(e) {
    return [];
  }
}

export function findMax(array:Array<number>):number {
  let max = -Infinity;
  for(let i = 0; i < array.length; ++i) {
    if (array[i] > max) max = array[i];
  }
  return max;
}

export function calcMeanAverage(array:Array<number>):number {
  if (!array.length) return 0;
  let sum = 0;
  for(let i = 0; i < array.length; ++i) {
    sum += array[i];
  }
  return sum / array.length;
}