export interface Point {
  row: number;
  col: number;
}

export const pointEq = (a: Point, b: Point): boolean =>
  a.row === b.row && a.col === b.col;
