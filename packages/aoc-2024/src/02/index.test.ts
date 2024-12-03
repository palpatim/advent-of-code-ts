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

/** Warning: mutates `diffs` */
const analyzeDiffsBroken = (
  diffs: number[],
  allowOneUnsafe: boolean = false
): boolean => {
  // Safe if:
  // - all diffs have the same sign
  // - abs(each diff) <= 3
  //
  // If there is an outlier, the report is unsafe
  //
  // If we allow removal of outliers, we can reduce the diff array by:
  //
  // - If there is more than 1 outlier, the report is unsafe
  // - If the outlier is the first or last element, the report is safe
  // - Otherwise, add the outlier to the previous and subsequent diff element,
  //   and then remove it.
  //
  //     ex 1:
  //       input: [8,6,4,4,1]
  //       diffs: [2,2,0,3]
  //       outlier: 0 (idx=2)
  //       reduced: [2,2,3]
  //       result is safe (reanalyzing diff == 0 outliers)
  //
  //     ex 2:
  //       input: [1,2,7,8,9]
  //       diffs: [-1,-5,-1,-1]
  //       outlier: -5 (idx=1)
  //       reduced: [-6,-6,-1]
  //       result is unsafe (reanalyzing diff == 2 outliers)
  //

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

  if (!allowOneUnsafe) {
    return outlierIndices.length === 0;
  }
  if (outlierIndices.length > 1) {
    return false;
  }

  const outlierIndex = outlierIndices[0];
  if (outlierIndex === 0 || outlierIndex === diffs.length - 1) {
    return true;
  }

  const outlierValue = diffs[outlierIndex];
  diffs[outlierIndex - 1] += outlierValue;
  diffs[outlierIndex + 1] += outlierValue;
  diffs.splice(outlierIndex, 1);

  return analyzeDiffsBroken(diffs, false);
};

const solveBroken = (
  input: string,
  allowOneUnsafe: boolean = false
): number => {
  const lines = input.split("\n");
  let result = 0;

  lines.forEach((line) => {
    const ints = line.split(/\s+/).map(Number);
    const diffs = getDiffs(ints);
    if (analyzeDiffsBroken(diffs, allowOneUnsafe)) {
      result += 1;
    }
  });

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
      const brokenResult = analyzeDiffsBroken(diffs, allowOneUnsafe);
      let workingResult = false;

      for (let j = 0; j < ints.length; j++) {
        const subArray = [...ints.slice(0, j), ...ints.slice(j + 1)];
        const subDiffs = getDiffs(subArray);
        if (analyzeDiffs(subDiffs)) {
          result += 1;
          workingResult = true;
          break;
        }
      }
      if (workingResult && !brokenResult) {
        console.log(`### Discrepancy: ${line}`);
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

  test.skip("analyze broken diff-based algorithm", () => {
    // Diff based algo doesn't account for a sign change and a large magnitude
    // ex 1 (INCORRECT RESULT):
    //   input: [62,59,63,65,68,69,72]
    //   diffs: [3,-4,-2,-3,-1,-3]
    //   outlier: 3 (idx=0)
    //   reduced: [-4,-2,-3,-1,-3]
    //   result is unsafe (-4 is an outlier)
    expect(solveBroken("62 59 63 65 68 69 72", true)).toEqual(1);

    // ex 2 (INCORRECT RESULT):
    //   input: [63,60,59,61,57]
    //   diffs: [3,1,-2,4]
    //   outlier: -2 (idx=2)
    //   reduced: [3,-1,2]
    //   result is unsafe (-1 is an outlier)
    expect(solveBroken("63 60 59 61 57", true)).toEqual(1);
  });
});
