import { Point } from "./point";

/** Offsets based on a rectangular grid with NW being origin; SE being the row[max], col[max] */
export type Offset = keyof typeof OFFSETS;

const OFFSETS = {
  NW: { row: -1, col: -1 },
  N: { row: -1, col: 0 },
  NE: { row: -1, col: 1 },
  W: { row: 0, col: -1 },
  E: { row: 0, col: 1 },
  SW: { row: 1, col: -1 },
  S: { row: 1, col: 0 },
  SE: { row: 1, col: 1 },
} as const;

export const allOffsets = (): Offset[] => Object.keys(OFFSETS) as Offset[];

export const getPointAtOffset = (p: Point, offset: Offset): Point => {
  return {
    row: p.row + OFFSETS[offset].row,
    col: p.col + OFFSETS[offset].col,
  };
};
