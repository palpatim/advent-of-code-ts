import { allOffsets, getPointAtOffset } from "./offset";
describe("offset", () => {
  describe("allOffsets", () => {
    it("Returns all values", () => {
      expect(allOffsets()).toEqual([
        "NW",
        "N",
        "NE",
        "W",
        "E",
        "SW",
        "S",
        "SE",
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
});
