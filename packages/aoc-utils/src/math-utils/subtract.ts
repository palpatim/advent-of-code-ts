export const subtractArray = (a: number[]): number =>
  a.slice(1).reduce((acc, curr) => acc - curr, a[0]);

export const subtractFixedArray = (a: [number, number]): number =>
  a.slice(1).reduce((acc, curr) => acc - curr, a[0]);

export const subtractSpread = (...a: number[]): number =>
  a.slice(1).reduce((acc, curr) => acc - curr, a[0]);

export const subtractTwoValues = (
  a: number,
  b: number
): number => a - b;
