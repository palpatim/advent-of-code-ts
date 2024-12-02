export const numericCompare = (a: number, b: number): number =>
  a - b < 0 ? -1 : a === b ? 0 : 1;
