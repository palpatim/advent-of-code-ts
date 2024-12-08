import { getOrigin } from "./grid-test-utils";
import { keyToPoint, pointEq, pointToKey } from "./point";

describe("point", () => {
  describe("pointEq", () => {
    test("should return true if points are equal", () => {
      expect(pointEq(getOrigin(), { row: 0, col: 0 })).toBe(true);
    });

    test("should return false if points are not equal", () => {
      expect(pointEq(getOrigin(), { row: 0, col: 1 })).toBe(false);
    });
  });

  describe("pointToKey", () => {
    test("should return a string representation of a point", () => {
      expect(pointToKey({ row: 1, col: 1 })).toBe("1,1");
    });

    test("should handle negative numbers", () => {
      expect(pointToKey({ row: -1, col: -1 })).toBe("-1,-1");
    });

    test("should handle origin", () => {
      expect(pointToKey(getOrigin())).toBe("0,0");
    });
  });

  describe("keyToPoint", () => {
    test("should return a string representation of a point", () => {
      expect(keyToPoint("1,1")).toEqual({ row: 1, col: 1 });
    });

    test("should handle negative numbers", () => {
      expect(keyToPoint("-1,-1")).toEqual({ row: -1, col: -1 });
    });

    test("should handle origin", () => {
      expect(keyToPoint("0,0")).toEqual(getOrigin());
    });

    test("handles keys with spaces", () => {
      expect(keyToPoint(" 0, 0 ")).toEqual(getOrigin());
    });

    test("handles negative numbers", () => {
      expect(keyToPoint(" -1, -2 ")).toEqual({ row: -1, col: -2 });
    });
  });
});