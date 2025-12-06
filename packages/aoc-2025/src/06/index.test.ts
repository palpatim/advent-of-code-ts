import {
  addArray,
  addTwoValues,
  Grid,
  GridOffsetIterator,
  multiplyArray,
  Point,
  readToString,
  rotateLeft,
} from "@palpatim/aoc-utils";
import * as path from "node:path";

type ArrayOperation = (ar: number[]) => number;

type Operator = "+" | "-" | "*" | "/";

const isDigit = (val: string): boolean => val.length === 1 && /[0-9]/.test(val);
const isOperator = (val: string): val is Operator => ["+", "*"].includes(val);

const operationForOperator = (op: Operator): ArrayOperation => {
  switch (op) {
    case "+":
      return addArray;
    case "*":
      return multiplyArray;
    default:
      throw new Error(`Unknown operator ${op}`);
  }
};

type HomeworkEntry = number | ArrayOperation;

const parseInput = (input: string): Grid<HomeworkEntry> => {
  const grid: Grid<HomeworkEntry> = input.split("\n").map((line) => {
    const entries = line.trim().split(/ +/);
    if (entries.every(isOperator)) {
      return entries.map(operationForOperator);
    } else {
      return entries.map(Number);
    }
  });

  return grid;
};

const solvePart1 = (input: string): number => {
  const initialGrid = parseInput(input);
  const grid = rotateLeft(initialGrid);
  console.log(grid);

  const result = grid.reduce((acc, line) => {
    const operands = line.slice(0, -1) as number[];
    const operation = line.slice(-1)[0] as ArrayOperation;
    const opResult = operation(operands);
    return acc + opResult;
  }, 0);

  return result;
};

const solvePart2 = (input: string): number => {
  const grid: Grid<string> = input.split("\n").map((l) => l.split(""));
  const lineLength = grid[0].length;

  const upperRight: Point = { row: 0, col: lineLength - 1 };

  // Iterate the columns of the grid from right to left
  const problemResults: number[] = [];
  let numbers: number[] = [];
  let currColStack: string[] = [];
  let operation: ArrayOperation | undefined;

  const colIterator = new GridOffsetIterator(grid, upperRight, "W");
  for (const { point: startPoint } of colIterator) {
    const rowIterator = new GridOffsetIterator(grid, startPoint, "S");

    if (rowIterator.every((v) => v === " ")) {
      continue;
    }

    rowIterator.reset();

    for (const { point, value } of rowIterator) {
      if (isOperator(value)) {
        numbers.push(Number(currColStack.join("")));

        operation = operationForOperator(value);
        const operationResult = operation(numbers);

        problemResults.push(operationResult);

        numbers = [];
        currColStack = [];
        operation = undefined;
      } else if (point.row == grid.length - 1) {
        numbers.push(Number(currColStack.join("")));
        currColStack = [];
      } else if (isDigit(value)) {
        currColStack.push(value);
      }
    }
  }

  const result = problemResults.reduce(addTwoValues, 0);
  return result;
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solvePart1(input)).toEqual(4277556);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solvePart1(input)).toEqual(5733696195703);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solvePart2(input)).toEqual(3263827);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solvePart2(input)).toEqual(10951882745757);
  });
});
