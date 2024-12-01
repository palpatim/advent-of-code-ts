export const getAtIndex =
  <T>(idx: number): ((a: T[]) => T) =>
  (a: T[]) =>
    a[idx];
