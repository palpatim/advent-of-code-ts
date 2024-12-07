export const multiplyArray = (a: number[]): number =>
  a.slice(1).reduce((acc, curr) => acc * curr, a[0]);

export const multiplyFixedArray = (a: [number, number]): number =>
  a.slice(1).reduce((acc, curr) => acc * curr, a[0]);

export const multiplySpread = (...a: number[]): number =>
  a.slice(1).reduce((acc, curr) => acc * curr, a[0]);

export const multiplyTwoValues = (a: number, b: number): number => a * b;
