import * as fs from "node:fs";
import * as path from "node:path";

const input = `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`;

const solve = (numberStrings: string[]): number => {
  const solution = numberStrings.reduce((acc, curr) => {
    if (curr === "") {
      return acc;
    }
    const f = curr.slice(0, 1);
    const l = curr.slice(-1);
    const n = parseInt(`${f}${l}`, 10);
    return acc + n;
  }, 0);
  console.log("solution:", solution);
  return solution;
};

const solve1 = (input: string): number => {
  const lines = input.split("\n");
  const numberStrings = lines.map((line) => line.replace(/[^\d]/g, ""));
  return solve(numberStrings);
};

const solve2 = (input: string): number => {
  const digitMap = {
    one: "o1ne",
    two: "t2wo",
    three: "t3hree",
    four: "f4our",
    five: "f5ive",
    six: "s6ix",
    seven: "s7even",
    eight: "e8ight",
    nine: "n9ine",
  };

  const lines = input.split("\n").filter((l) => l.length > 0);
  const numberStringLines = lines.map((l) => {
    let line = l;
    for (const [k, v] of Object.entries(digitMap)) {
      line = line.replace(new RegExp(k, "g"), v);
    }
    line = line.replace(/[^\d]/g, "");
    return line;
  });
  return solve(numberStringLines);
};

describe("aoc", () => {
  test("demo 1", () => {
    expect(solve1(input)).toEqual(142);
  });

  test("part 1", () => {
    const f = path.join(__dirname, "input-1.txt");
    const input = fs.readFileSync(f).toString();
    expect(solve1(input)).toEqual(54644);
  });

  test("demo 2", () => {
    const input = `
    two1nine
    eightwothree
    abcone2threexyz
    xtwone3four
    4nineeightseven2
    zoneight234
    7pqrstsixteen
  `;
    expect(solve2(input)).toEqual(281);
  });

  test("part 2", () => {
    const f = path.join(__dirname, "input-1.txt");
    const input = fs.readFileSync(f).toString();
    expect(solve2(input)).toEqual(53348);
  });
});
