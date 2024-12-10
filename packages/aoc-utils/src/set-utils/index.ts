export const difference = <T>(a: Set<T>, b: Set<T>): Set<T> => {
  const result = new Set<T>(a);
  b.forEach((v) => result.delete(v));
  return result;
};

export const intersection = <T>(a: Set<T>, b: Set<T>): Set<T> => {
  const result = new Set<T>();
  a.forEach((v) => {
    if (b.has(v)) {
      result.add(v);
    }
  });
  return result;
};

export const union = <T>(a: Set<T>, b: Set<T>): Set<T> => {
  const result = new Set<T>(a);
  b.forEach((v) => result.add(v));
  return result;
};
