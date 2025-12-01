/**
 * Returns the sum of the elements of an array
 */
export const addArray = (a: number[]): number =>
  a.slice(1).reduce((acc, curr) => acc + curr, a[0]);

/**
 * Returns the sum of the elements of a 2-tuple
 */
export const addFixedArray = (a: [number, number]): number => addArray(a);

/**
 * Returns the sum of the elements of a spread array
 */
export const addSpread = (...a: number[]): number => addArray(a);

/**
 * Returns the sum of two values
 */
export const addTwoValues = (a: number, b: number): number => a + b;
