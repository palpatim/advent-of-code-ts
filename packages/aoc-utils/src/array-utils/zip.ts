export const zip = <T, U>(arA: T[], arB: U[]): [T, U][] => {
  const result: [T, U][] = [];
  for (let i = 0; i < arA.length; i++) {
    result.push([arA[i], arB[i]]);
  }
  return result;
};
