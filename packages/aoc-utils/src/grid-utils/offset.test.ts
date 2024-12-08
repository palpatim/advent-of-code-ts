import { getOrigin } from "./grid-test-utils";
import { allNamedOffsets, getPointAtOffset, getOffset } from "./offset";
describe("offset", () => {
  describe("allOffsets", () => {
    it("Returns all values", () => {
      expect(allNamedOffsets()).toEqual([
        "E",
        "N",
        "NE",
        "NW",
        "S",
        "SE",
        "SW",
        "W",
      ]);
    });
  });

  describe("getPointAtOffset", () => {
    test("NW", () => {
      expect(getPointAtOffset({ row: 0, col: 0 }, "NW")).toEqual({
        row: -1,
        col: -1,
      });
    });
    test("N", () => {
      expect(getPointAtOffset({ row: 0, col: 0 }, "N")).toEqual({
        row: -1,
        col: 0,
      });
    });
    test("NE", () => {
      expect(getPointAtOffset({ row: 0, col: 0 }, "NE")).toEqual({
        row: -1,
        col: 1,
      });
    });
    test("W", () => {
      expect(getPointAtOffset({ row: 0, col: 0 }, "W")).toEqual({
        row: 0,
        col: -1,
      });
    });
    test("E", () => {
      expect(getPointAtOffset({ row: 0, col: 0 }, "E")).toEqual({
        row: 0,
        col: 1,
      });
    });
    test("SW", () => {
      expect(getPointAtOffset({ row: 0, col: 0 }, "SW")).toEqual({
        row: 1,
        col: -1,
      });
    });
    test("S", () => {
      expect(getPointAtOffset({ row: 0, col: 0 }, "S")).toEqual({
        row: 1,
        col: 0,
      });
    });
    test("SE", () => {
      expect(getPointAtOffset({ row: 0, col: 0 }, "SE")).toEqual({
        row: 1,
        col: 1,
      });
    });
  });

  describe("getOffset", () => {
    test("returns zero offset", () => {
      expect(getOffset(getOrigin(), getOrigin())).toEqual({
        deltaRow: 0,
        deltaCol: 0,
      });
    });

    test("returns offset", () => {
      expect(getOffset(getOrigin(), { row: 1, col: 1 })).toEqual({
        deltaRow: 1,
        deltaCol: 1,
      });
    });

    test("returns negative offset", () => {
      expect(getOffset(getOrigin(), { row: -1, col: -1 })).toEqual({
        deltaRow: -1,
        deltaCol: -1,
      });
    });
  });
});
