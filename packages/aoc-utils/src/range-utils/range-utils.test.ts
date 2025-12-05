import { ClosedRange, rangeComparator } from "./index";

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

  describe("fromDelimitedString", () => {
    test("should parse range with default delimiter", () => {
      const range = ClosedRange.fromDelimitedString("1-5");
      expect(range.lower).toBe(1);
      expect(range.upper).toBe(5);
    });

    test("should parse range with custom delimiter", () => {
      const range = ClosedRange.fromDelimitedString("10,20", ",");
      expect(range.lower).toBe(10);
      expect(range.upper).toBe(20);
    });

    test("should parse single element range", () => {
      const range = ClosedRange.fromDelimitedString("7-7");
      expect(range.lower).toBe(7);
      expect(range.upper).toBe(7);
    });

    test("should parse negative numbers with custom delimiter", () => {
      const range = ClosedRange.fromDelimitedString("-5,-1", ",");
      expect(range.lower).toBe(-5);
      expect(range.upper).toBe(-1);
    });

    test("should parse range with zero", () => {
      const range = ClosedRange.fromDelimitedString("-1,1", ",");
      expect(range.lower).toBe(-1);
      expect(range.upper).toBe(1);
    });

    test("should throw error for invalid range", () => {
      expect(() => ClosedRange.fromDelimitedString("5-1")).toThrow(
        "lower (5) must be <= upper (1)"
      );
    });
  });

  describe("size", () => {
    test("should return correct size for multi-element range", () => {
      const range = new ClosedRange(1, 5);
      expect(range.size()).toBe(5);
    });

    test("should return 1 for single element range", () => {
      const range = new ClosedRange(3, 3);
      expect(range.size()).toBe(1);
    });

    test("should handle negative ranges", () => {
      const range = new ClosedRange(-5, -1);
      expect(range.size()).toBe(5);
    });

    test("should handle range crossing zero", () => {
      const range = new ClosedRange(-2, 2);
      expect(range.size()).toBe(5);
    });
  });

  describe("overlaps", () => {
    test("should return true for partial overlap", () => {
      const range1 = new ClosedRange(1, 5);
      const range2 = new ClosedRange(3, 7);
      expect(range1.overlaps(range2)).toBe(true);
    });

    test("should return true for complete overlap", () => {
      const range1 = new ClosedRange(1, 5);
      const range2 = new ClosedRange(2, 4);
      expect(range1.overlaps(range2)).toBe(true);
    });

    test("should return true for identical ranges", () => {
      const range1 = new ClosedRange(1, 5);
      const range2 = new ClosedRange(1, 5);
      expect(range1.overlaps(range2)).toBe(true);
    });

    test("should return true for touching ranges", () => {
      const range1 = new ClosedRange(1, 5);
      const range2 = new ClosedRange(5, 8);
      expect(range1.overlaps(range2)).toBe(true);
    });

    test("should return false for non-overlapping ranges", () => {
      const range1 = new ClosedRange(1, 3);
      const range2 = new ClosedRange(5, 7);
      expect(range1.overlaps(range2)).toBe(false);
    });

    test("should return true for single element ranges that overlap", () => {
      const range1 = new ClosedRange(3, 3);
      const range2 = new ClosedRange(3, 3);
      expect(range1.overlaps(range2)).toBe(true);
    });
  });

  describe("merge", () => {
    test("should merge overlapping ranges", () => {
      const range1 = new ClosedRange(1, 5);
      const range2 = new ClosedRange(3, 7);
      const merged = range1.merge(range2);
      expect(merged.lower).toBe(1);
      expect(merged.upper).toBe(7);
    });

    test("should merge non-overlapping ranges", () => {
      const range1 = new ClosedRange(1, 3);
      const range2 = new ClosedRange(5, 7);
      const merged = range1.merge(range2);
      expect(merged.lower).toBe(1);
      expect(merged.upper).toBe(7);
    });

    test("should merge identical ranges", () => {
      const range1 = new ClosedRange(2, 5);
      const range2 = new ClosedRange(2, 5);
      const merged = range1.merge(range2);
      expect(merged.lower).toBe(2);
      expect(merged.upper).toBe(5);
    });

    test("should merge when one range contains the other", () => {
      const range1 = new ClosedRange(1, 8);
      const range2 = new ClosedRange(3, 5);
      const merged = range1.merge(range2);
      expect(merged.lower).toBe(1);
      expect(merged.upper).toBe(8);
    });

    test("should merge single element ranges", () => {
      const range1 = new ClosedRange(3, 3);
      const range2 = new ClosedRange(5, 5);
      const merged = range1.merge(range2);
      expect(merged.lower).toBe(3);
      expect(merged.upper).toBe(5);
    });

    test("should handle negative ranges", () => {
      const range1 = new ClosedRange(-5, -2);
      const range2 = new ClosedRange(-3, 1);
      const merged = range1.merge(range2);
      expect(merged.lower).toBe(-5);
      expect(merged.upper).toBe(1);
    });
  });

  describe("rangeComparator", () => {
    test("should return negative when first range has lower start", () => {
      const range1 = new ClosedRange(1, 5);
      const range2 = new ClosedRange(3, 7);
      expect(rangeComparator(range1, range2)).toBe(-1);
    });

    test("should return positive when first range has higher start", () => {
      const range1 = new ClosedRange(5, 8);
      const range2 = new ClosedRange(2, 6);
      expect(rangeComparator(range1, range2)).toBe(1);
    });

    test("should compare by upper bound when lower bounds are equal", () => {
      const range1 = new ClosedRange(1, 3);
      const range2 = new ClosedRange(1, 5);
      expect(rangeComparator(range1, range2)).toBe(-2);
    });

    test("should return zero for identical ranges", () => {
      const range1 = new ClosedRange(1, 5);
      const range2 = new ClosedRange(1, 5);
      expect(rangeComparator(range1, range2)).toBe(0);
    });

    test("should work with array sort", () => {
      const ranges = [
        new ClosedRange(5, 8),
        new ClosedRange(1, 3),
        new ClosedRange(1, 5),
        new ClosedRange(3, 4),
      ];
      ranges.sort(rangeComparator);
      expect(ranges.map((r) => [r.lower, r.upper])).toEqual([
        [1, 3],
        [1, 5],
        [3, 4],
        [5, 8],
      ]);
    });
  });
});
