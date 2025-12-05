import {
  addTwoValues,
  ClosedRange,
  parseBase10Int,
  rangeComparator,
  readToString,
} from "@palpatim/aoc-utils";
import * as path from "node:path";

interface PuzzleInput {
  freshIngredients: ClosedRange[];
  ingredientList: number[];
}

const parseInput = (input: string): PuzzleInput => {
  const [ranges, ingredients] = input.split("\n\n");

  const freshIngredients = ranges
    .split("\n")
    .map((line) => ClosedRange.fromDelimitedString(line));

  const ingredientList = ingredients.split("\n").map(parseBase10Int);

  return { freshIngredients, ingredientList };
};

const solvePart1 = (input: string): number => {
  const { freshIngredients, ingredientList } = parseInput(input);

  let count = 0;
  for (const ingredient of ingredientList) {
    for (const range of freshIngredients) {
      if (range.contains(ingredient)) {
        count += 1;
        break;
      }
    }
  }
  return count;
};

const solvePart2 = (input: string): number => {
  const { freshIngredients } = parseInput(input);

  // Merge all overlapping ranges in `freshIngredients`. Then iterate over each
  // range to calculate its size. Return the sum of all of the sizes of the
  // merged ranges.
  const sortedRanges = freshIngredients.sort(rangeComparator);
  const mergedRanges: ClosedRange[] = [sortedRanges[0]];
  for (const range of sortedRanges.slice(1)) {
    const lastRange = mergedRanges[mergedRanges.length - 1];
    if (lastRange.overlaps(range)) {
      mergedRanges[mergedRanges.length - 1] = lastRange.merge(range);
    } else {
      mergedRanges.push(range);
    }
  }

  const count = mergedRanges.map((r) => r.size()).reduce(addTwoValues, 0);
  return count;
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solvePart1(input)).toEqual(3);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solvePart1(input)).toEqual(601);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solvePart2(input)).toEqual(14);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solvePart2(input)).toEqual(367899984917516);
  });
});
