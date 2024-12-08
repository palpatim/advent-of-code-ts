export interface Point {
  row: number;
  col: number;
}

export const pointEq = (a: Point, b: Point): boolean =>
  a.row === b.row && a.col === b.col;

export const pointToKey = (p: Point): string => `${p.row},${p.col}`;

export const keyToPoint = (key: string): Point => {
  const [row, col] = key.split(",").map(Number);
  return { row, col };
};
