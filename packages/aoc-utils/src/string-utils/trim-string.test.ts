import { trimString } from "./trim-string";

describe("trimString", () => {
  it("should trim a string", () => {
    expect(trimString("  test  ")).toBe("test");
  });

  it("should not trim internal spaces", () => {
    expect(trimString("  test   test  ")).toBe("test   test");
  });

  it("should handle an empty string", () => {
    expect(trimString("")).toBe("");
  });

  it("should handle a whitespace-only string", () => {
    expect(trimString("  ")).toBe("");
  });
});
