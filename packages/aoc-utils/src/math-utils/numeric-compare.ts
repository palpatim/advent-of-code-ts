/**
 * A functional numeric comparator that returns -1 if a<b; 0 of a===b, and 1 if
 * a>b
 */
export const numericCompare = (a: number, b: number): number =>
  a - b < 0 ? -1 : a === b ? 0 : 1;
