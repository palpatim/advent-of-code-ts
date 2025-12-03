import { ClosedRange } from "./index";

describe("ClosedRange", () => {
  describe("constructor", () => {
    test("should create a valid range when lower <= upper", () => {
      const range = new ClosedRange(1, 5);
      expect(range.lower).toBe(1);
      expect(range.upper).toBe(5);
    });

    test("should create a valid one-element range when lower equals upper", () => {
      const range = new ClosedRange(3, 3);
      expect(range.lower).toBe(3);
      expect(range.upper).toBe(3);
    });

    test("should throw error when lower > upper", () => {
      expect(() => new ClosedRange(5, 1)).toThrow(
        "lower (5) must be <= upper (1)"
      );
    });
  });

  describe("contains", () => {
    test("should return true for element within range", () => {
      const range = new ClosedRange(1, 5);
      expect(range.contains(3)).toBe(true);
    });

    test("should return true for lower bound (inclusive)", () => {
      const range = new ClosedRange(1, 5);
      expect(range.contains(1)).toBe(true);
    });

    test("should return true for upper bound (inclusive)", () => {
      const range = new ClosedRange(1, 5);
      expect(range.contains(5)).toBe(true);
    });

    test("should return false for element below range", () => {
      const range = new ClosedRange(1, 5);
      expect(range.contains(0)).toBe(false);
    });

    test("should return false for element above range", () => {
      const range = new ClosedRange(1, 5);
      expect(range.contains(6)).toBe(false);
    });

    test("should return true for one-element range", () => {
      const range = new ClosedRange(3, 3);
      expect(range.contains(3)).toBe(true);
    });

    test("should handle negative numbers", () => {
      const range = new ClosedRange(-5, -1);
      expect(range.contains(-3)).toBe(true);
      expect(range.contains(-5)).toBe(true);
      expect(range.contains(-1)).toBe(true);
    });

    test("should handle zero", () => {
      const range = new ClosedRange(-1, 1);
      expect(range.contains(0)).toBe(true);
    });
  });

  describe("iterator", () => {
    test("should iterate over all values in range", () => {
      const range = new ClosedRange(1, 3);
      const values = Array.from(range);
      expect(values).toEqual([1, 2, 3]);
    });

    test("should iterate over single element range", () => {
      const range = new ClosedRange(5, 5);
      const values = Array.from(range);
      expect(values).toEqual([5]);
    });

    test("should iterate over negative range", () => {
      const range = new ClosedRange(-2, 0);
      const values = Array.from(range);
      expect(values).toEqual([-2, -1, 0]);
    });

    test("should work with for...of loop", () => {
      const range = new ClosedRange(1, 3);
      const values: number[] = [];
      for (const value of range) {
        values.push(value);
      }
      expect(values).toEqual([1, 2, 3]);
    });

    test("should work with spread operator", () => {
      const range = new ClosedRange(1, 3);
      expect([...range]).toEqual([1, 2, 3]);
    });
  });
});