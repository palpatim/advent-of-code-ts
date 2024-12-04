import { Grid } from "./grid";
import { Point } from "./point";

export const getOrigin = (): Point => ({ row: 0, col: 0 });
export const getGrid = (): Grid<number> => [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
];
