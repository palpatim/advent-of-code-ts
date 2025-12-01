/**
 * Given an index value `idx`, return a function that takes an array and returns
 * `array[idx]`
 */
export const getAtIndex =
  <T>(idx: number): ((a: T[]) => T) =>
  (a: T[]) =>
    a[idx];
