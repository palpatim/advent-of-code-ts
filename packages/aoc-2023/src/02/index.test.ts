import * as fs from "node:fs";
import * as path from "node:path";

interface RawResult {
  results: number[];
  max: number;
}

interface TurnResult {
  red: RawResult;
  green: RawResult;
  blue: RawResult;
}

const makeColorResultsRegExp = (color: string): RegExp =>
  new RegExp(`([0-9]+) ${color}`, "g");

const collectResultsForColor = (color: string, line: string): number[] => {
  const re = makeColorResultsRegExp(color);

  let matches = re.exec(line);
  const results: number[] = [];
  while (matches !== null) {
    results.push(parseInt(matches[1], 10));
    matches = re.exec(line);
  }

  return results;
};

const lineToRawResultForColor = (color: string, line: string): RawResult => {
  const results = collectResultsForColor(color, line);
  return {
    results,
    max: Math.max(...results),
  };
};

const lineToGameResult = (line: string): Record<string, TurnResult> => {
  const gameRegExp = new RegExp("Game ([0-9]+):");
  const match = gameRegExp.exec(line);
  if (match === null) {
    throw new Error(`Malformed line: '${line}'`);
  }
  const gameNumber = parseInt(match[1], 10);
  return {
    [`${gameNumber}`]: {
      red: lineToRawResultForColor("red", line),
      green: lineToRawResultForColor("green", line),
      blue: lineToRawResultForColor("blue", line),
    },
  };
};

const getResultMap = (input: string): Record<string, TurnResult> => {
  const lines = input.split("\n").map((l) => l.trim());
  const resultMap = lines.reduce((acc, curr) => {
    return {
      ...acc,
      ...lineToGameResult(curr),
    };
  }, {} as Record<string, TurnResult>);
  return resultMap;
};

const add = (a: number, b: number): number => a + b;

const solve1 = (
  input: string,
  limit: { red: number; green: number; blue: number }
): number => {
  const resultMap = getResultMap(input);

  const possibleResults = Object.keys(resultMap).filter((k) => {
    return (
      resultMap[k].red.max <= limit.red &&
      resultMap[k].green.max <= limit.green &&
      resultMap[k].blue.max <= limit.blue
    );
  });

  const numericResults = possibleResults.map((k) => parseInt(k, 10));
  const result = numericResults.reduce(add, 0);
  return result;
};

const solve2 = (input: string): number => {
  const resultMap = getResultMap(input);

  const totalPower = Object.keys(resultMap).reduce((acc, curr) => {
    const gamePower =
      resultMap[curr].red.max *
      resultMap[curr].green.max *
      resultMap[curr].blue.max;
      return acc + gamePower;
  }, 0);

  return totalPower;
};

describe("aoc", () => {
  test("demo 1", () => {
    const f = path.join(__dirname, "input.demo.txt");
    const input = fs.readFileSync(f).toString();
    expect(solve1(input, { red: 12, green: 13, blue: 14 })).toEqual(8);
  });

  test("part 1", () => {
    const f = path.join(__dirname, "input-1.txt");
    const input = fs.readFileSync(f).toString();
    expect(solve1(input, { red: 12, green: 13, blue: 14 })).toEqual(2149);
  });

  test("demo 2", () => {
    const f = path.join(__dirname, "input.demo.txt");
    const input = fs.readFileSync(f).toString();
    expect(solve2(input)).toEqual(2286);
  });

  test("part 2", () => {
    const f = path.join(__dirname, "input-1.txt");
    const input = fs.readFileSync(f).toString();
    expect(solve2(input)).toEqual(71274);
  });

});
