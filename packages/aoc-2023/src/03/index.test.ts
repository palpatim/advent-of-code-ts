import * as fs from "node:fs";
import * as path from "node:path";
import { getAdjacentCells } from "@palpatim/aoc-utils";

const parseGrid = (input: string): string[][] => {
  const grid = input.split("\n").map((line) => line.split(""));
  return grid;
};

const solve1 = (input: string): number => {
  const grid = parseGrid(input);

  const partNumbers: number[] = [];
  let currentNumberChars: string[] = [];
  let isPartNumber = false;

  const isParsingNumber = (): boolean => currentNumberChars.length > 0;

  const registerPartNumber = () => {
    const numberStr = currentNumberChars.join("");
    const partNumber = parseInt(numberStr, 10);
    partNumbers.push(partNumber);
  };

  const resetState = () => {
    isPartNumber = false;
    currentNumberChars = [];
  };

  const isCellAdjacentToSymbol = (row: number, col: number) => {
    const adjacentCells = getAdjacentCells({ row, col }, grid);
    return adjacentCells.some(isSymbol);
  };

  // Parse a cell at a time
  let row = 0;
  while (row < grid.length) {
    let col = 0;
    const line = grid[row];

    while (col < line.length) {
      const char = line[col];
      if (isDigit(char)) {
        currentNumberChars.push(char);
        isPartNumber = isPartNumber || isCellAdjacentToSymbol(row, col);
      } else {
        if (isParsingNumber()) {
          if (isPartNumber) {
            registerPartNumber();
          }
          resetState();
        }
      }

      col += 1;
    }

    if (isParsingNumber()) {
      if (isPartNumber) {
        registerPartNumber();
      }
      resetState();
    }
    row += 1;
  }

  const result = add(...partNumbers);
  return result;
};

const isDigit = (str: string): boolean => !Number.isNaN(parseInt(str, 10));
const isSpace = (str: string): boolean => str === "." || str === " ";
const isSymbol = (str: string): boolean => !isDigit(str) && !isSpace(str);
const add = (...numbers: number[]): number =>
  numbers.reduce((acc, curr) => acc + curr, 0);

const solve2 = (input: string): number => parseInt(input, 10);

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

  test.skip("demo 2", () => {
    const f = path.join(__dirname, "input.demo.txt");
    const input = fs.readFileSync(f).toString();
    expect(solve2(input)).toEqual(1);
  });

  test.skip("part 2", () => {
    const f = path.join(__dirname, "input-1.txt");
    const input = fs.readFileSync(f).toString();
    expect(solve2(input)).toEqual(1);
  });
});
