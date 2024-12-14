import { getOrigin, getGrid } from "./grid-test-utils";
import {
  getAdjacentCells,
  getCellAtOffsetFromPoint,
  getCellAtPoint,
  isValidPoint,
  rotateLeft,
  setCellAtPoint,
} from "./grid";

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

  describe("rotateLeft", () => {
    test("handles simple case", () => {
      const grid = getGrid();
      expect(rotateLeft(grid)).toEqual([
        [2, 5, 8],
        [1, 4, 7],
        [0, 3, 6],
      ]);
    });

    test("handles empty grid", () => {
      expect(rotateLeft([])).toEqual([]);
    });
  });

  describe("setCellAtPoint", () => {
    test("handles simple case", () => {
      const grid = getGrid();
      setCellAtPoint(99, getOrigin(), grid);
      expect(grid).toEqual([
        [99, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      ]);

    });

    test("does nothing for invalid points", () => {
      const grid = getGrid();
      setCellAtPoint(99, { row: 100, col: 100 }, grid);
      expect(grid).toEqual([
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      ]);
    });
  });
});
