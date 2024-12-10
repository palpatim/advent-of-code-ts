import { difference, intersection, union } from "./index";

describe("set utilities", () => {
  describe("difference", () => {
    it("should return a difference of two sets", () => {
      expect(difference(new Set([0, 1]), new Set([1, 2]))).toEqual(
        new Set([0])
      );
    });

    it("should handle an empty set", () => {
      expect(difference(new Set([0, 1]), new Set())).toEqual(new Set([0, 1]));
    });

    it("should handle empty sets", () => {
      expect(difference(new Set(), new Set())).toEqual(new Set());
    });
  });

  describe("intersection", () => {
    it("should return an intersection of two sets", () => {
      expect(intersection(new Set([0, 1]), new Set([1, 2]))).toEqual(
        new Set([1])
      );
    });

    it("should handle a set with no overlapping members", () => {
      expect(intersection(new Set([0, 1]), new Set([2, 3]))).toEqual(new Set());
    });

    it("should handle an empty set", () => {
      expect(intersection(new Set([0, 1]), new Set())).toEqual(new Set());
    });

    it("should handle empty sets", () => {
      expect(intersection(new Set(), new Set())).toEqual(new Set());
    });
  });

  describe("union", () => {
    it("should return a union of two sets", () => {
      expect(union(new Set([0, 1]), new Set([2, 3]))).toEqual(
        new Set([0, 1, 2, 3])
      );
    });

    it("should handle an empty set", () => {
      expect(union(new Set([0, 1]), new Set())).toEqual(new Set([0, 1]));
    });

    it("should handle empty sets", () => {
      expect(union(new Set(), new Set())).toEqual(new Set());
    });
  });
});
