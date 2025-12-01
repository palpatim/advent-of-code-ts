/**
 * Returns the difference of the elements of an array
 */
export const subtractArray = (a: number[]): number =>
  a.slice(1).reduce((acc, curr) => acc - curr, a[0]);

/**
 * Returns the difference of the elements of a 2-typle
 */
export const subtractFixedArray = (a: [number, number]): number =>
  subtractArray(a);

/**
 * Returns the difference of the elements of a spread array
 */
export const subtractSpread = (...a: number[]): number => subtractArray(a);

/**
 * Returns the difference of two numbers
 */
export const subtractTwoValues = (a: number, b: number): number => a - b;
