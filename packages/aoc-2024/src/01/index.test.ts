import * as fs from "node:fs";
import * as path from "node:path";

describe("aoc", () => {
  test("demo 1", () => {
    const f = path.join(__dirname, "input.demo.txt");
    const input = fs.readFileSync(f).toString();
    expect(solve1(input)).toEqual(4361);
  });

  test("part 1", () => {
    const f = path.join(__dirname, "input-1.txt");
    const input = fs.readFileSync(f).toString();
    expect(solve1(input)).toEqual(525911);
  });

  test("demo 2", () => {
    const f = path.join(__dirname, "input.demo.txt");
    const input = fs.readFileSync(f).toString();
    expect(solve2(input)).toEqual(1);
  });

  test("part 2", () => {
    const f = path.join(__dirname, "input-1.txt");
    const input = fs.readFileSync(f).toString();
    expect(solve2(input)).toEqual(1);
  });
});
