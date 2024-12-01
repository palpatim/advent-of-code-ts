export const addArray = (a: number[]): number =>
  a.slice(1).reduce((acc, curr) => acc + curr, a[0]);

export const addFixedArray = (a: [number, number]): number =>
  a.slice(1).reduce((acc, curr) => acc + curr, a[0]);

export const addSpread = (...a: number[]): number =>
  a.slice(1).reduce((acc, curr) => acc + curr, a[0]);

export const addTwoValues = (
  a: number,
  b: number
): number => a + b;
