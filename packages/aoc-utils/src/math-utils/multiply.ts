/**
 * Returns the product of the elements of an array
 */
export const multiplyArray = (a: number[]): number =>
  a.slice(1).reduce((acc, curr) => acc * curr, a[0]);

/**
 * Returns the product of the elements of a 2-tuple
 */
export const multiplyFixedArray = (a: [number, number]): number =>
  multiplyArray(a);

/**
 * Returns the product of the elements of a spread array
 */
export const multiplySpread = (...a: number[]): number => multiplyArray(a);

/**
 * Returns the product of two numbers
 */
export const multiplyTwoValues = (a: number, b: number): number => a * b;
