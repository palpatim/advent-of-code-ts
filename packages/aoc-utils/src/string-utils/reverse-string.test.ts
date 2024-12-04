import { reverseString } from "./reverse-string";

describe("reverseString", () => {
  it("should reverse a string", () => {
    expect(reverseString("hello")).toBe("olleh");
  });

  it("handles an empty string", () => {
    expect(reverseString("")).toBe("");
  });

  it("handles a single character string", () => {
    expect(reverseString("a")).toBe("a");
  });
});
