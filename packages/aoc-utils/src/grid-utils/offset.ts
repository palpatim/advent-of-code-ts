import { Point } from "./point";

/** Offsets based on a rectangular grid with NW being origin; SE being the row[max], col[max] */
export type NamedOffset = keyof typeof NAMED_OFFSETS;

export interface Offset {
  deltaRow: number;
  deltaCol: number;
}

const NAMED_OFFSETS = {
  NW: { deltaRow: -1, deltaCol: -1 },
  N: { deltaRow: -1, deltaCol: 0 },
  NE: { deltaRow: -1, deltaCol: 1 },
  W: { deltaRow: 0, deltaCol: -1 },
  E: { deltaRow: 0, deltaCol: 1 },
  SW: { deltaRow: 1, deltaCol: -1 },
  S: { deltaRow: 1, deltaCol: 0 },
  SE: { deltaRow: 1, deltaCol: 1 },
} as const;

export const allNamedOffsets = (): NamedOffset[] =>
  Object.keys(NAMED_OFFSETS).sort() as NamedOffset[];

export const getPointAtOffset = (
  p: Point,
  offset: NamedOffset | Offset
): Point => {
  return {
    row: p.row + resolveOffset(offset).deltaRow,
    col: p.col + resolveOffset(offset).deltaCol,
  };
};

const resolveOffset = (candidate: NamedOffset | Offset): Offset => {
  if (typeof candidate === "string") {
    return NAMED_OFFSETS[candidate];
  }
  return candidate;
};

export const getOffset = (a: Point, b: Point): Offset => {
  const deltaRow = b.row - a.row;
  const deltaCol = b.col - a.col;
  return { deltaRow, deltaCol };
};
