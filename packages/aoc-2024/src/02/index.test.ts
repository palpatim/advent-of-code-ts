import { abs, readToString } from "@palpatim/aoc-utils";
import * as path from "node:path";

/** Returns an array of the differences between each element */
const getDiffs = (a: number[]): number[] => {
  const result: number[] = [];
  let i = 0;
  for (let j = 1; j < a.length; j++) {
    result.push(a[i] - a[j]);
    i = j;
  }
  return result;
};

const analyzeDiffs = (diffs: number[]): boolean => {
  // Safe if:
  // - all diffs have the same sign
  // - abs(each diff) <= 3
  //
  // If there is an outlier, the report is unsafe
  const numberOfNegativeDiffs = diffs.reduce(
    (acc, curr) => (curr < 0 ? acc + 1 : acc),
    0
  );
  const numberOfPositiveDiffs = diffs.length - numberOfNegativeDiffs;

  const expectedDirectionComparator =
    numberOfNegativeDiffs > numberOfPositiveDiffs
      ? (n: number) => n < 0
      : (n: number) => n > 0;
  const expectedDiffComparator = (n: number): boolean => abs(n) <= 3;

  const outlierIndices: number[] = [];
  diffs.forEach((v, idx) => {
    if (expectedDiffComparator(v) && expectedDirectionComparator(v)) {
      return;
    } else {
      outlierIndices.push(idx);
    }
  });

  return outlierIndices.length === 0;
};

const solve = (input: string, allowOneUnsafe: boolean = false): number => {
  const lines = input.split("\n");
  let result = 0;

  lines.forEach((line) => {
    const ints = line.split(/\s+/).map(Number);
    const diffs = getDiffs(ints);
    if (analyzeDiffs(diffs)) {
      result += 1;
    } else if (allowOneUnsafe) {
      for (let j = 0; j < ints.length; j++) {
        const subArray = [...ints.slice(0, j), ...ints.slice(j + 1)];
        const subDiffs = getDiffs(subArray);
        if (analyzeDiffs(subDiffs)) {
          result +=1 ;
          break;
        }
      }
    }
  });

  return result;
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input)).toEqual(2);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input)).toEqual(591);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input, true)).toEqual(4);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    // Original algo == 619, which is too low
    expect(solve(input, true)).toEqual(621);
  });
});
