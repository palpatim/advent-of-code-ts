import {
  getAdjacentCells,
  getCellAtOffsetFromPoint,
  getCellAtPoint,
  Grid,
  isValidPoint,
} from "./grid";
import { Point } from "./point";

const getOrigin = (): Point => ({ row: 0, col: 0 });
const getGrid = (): Grid<number> => [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
];

describe("grid-utils", () => {
  describe("isValidPoint", () => {
    test("handles origin", () => {
      expect(isValidPoint(getOrigin(), getGrid())).toBeTruthy();
    });
    test("handles invalid offset", () => {
      expect(isValidPoint({ row: -1, col: 0 }, getGrid())).toBeFalsy();
    });
  });

  describe("getCellAtPoint", () => {
    test("handles valid point", () => {
      expect(getCellAtPoint(getOrigin(), getGrid())).toBe(0);
    });
    test("handles invalid point", () => {
      expect(getCellAtPoint({ row: -1, col: 0 }, getGrid())).not.toBeDefined();
    });
  });

  describe("getCellAtOffsetFromPoint", () => {
    test("handles valid point", () => {
      expect(getCellAtOffsetFromPoint(getOrigin(), "SE", getGrid())).toBe(4);
    });
    test("handles invalid point", () => {
      expect(
        getCellAtOffsetFromPoint(getOrigin(), "N", getGrid())
      ).not.toBeDefined();
    });
  });

  describe("getAdjacentCells", () => {
    test("handles edge", () => {
      expect(getAdjacentCells(getOrigin(), getGrid())).toEqual(
        expect.arrayContaining([1, 3, 4])
      );
    });

    test("handles interior", () => {
      expect(getAdjacentCells({ row: 1, col: 1 }, getGrid())).toEqual(
        expect.arrayContaining([0, 1, 2, 3, 5, 6, 7, 8])
      );
    });
  });
});
