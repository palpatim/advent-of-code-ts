import { Offset, Point, readToString } from "@palpatim/aoc-utils";
import * as path from "node:path";

interface Machine {
  buttonA: Offset;
  buttonB: Offset;
  prize: Point;
}

const buttonAPrice = 3;
const buttonBPrice = 1;

interface PlayResult {
  a: number;
  b: number;
}

/**
 * Given a Machine with buttons a & b, with offsets adX, adY, bdX, bdY, and a
 * target px, py:
 *
 *     (a * adX) + (b * bdX) = px
 *     (a * adY) + (b * bdY) = py
 *
 *     a = (px - (b * bdX)) / adX
 *
 *     b = (py - (((px - (b * bdX)) / adX) * adY)) / bdY
 *
 *     b = ((py * adX) - (px * adY)) / ((bdY * adX) - (bdX * adY))
 *
 */
const findResult = (machine: Machine): PlayResult => {
  const {
    buttonA: { deltaCol: adX, deltaRow: adY },
    buttonB: { deltaCol: bdX, deltaRow: bdY },
    prize: { col: px, row: py },
  } = machine;
  const b = (py * adX - px * adY) / (bdY * adX - bdX * adY);
  const a = (px - b * bdX) / adX;
  return { a, b };
};

const solve = (input: string, prizeOffset: number = 0): number => {
  const lines = input.split("\n");
  const machines: Machine[] = [];
  const numberRegex = /(\d+),.*?(\d+)/;

  let currentMachine: Partial<Machine> = {};
  for (const line of lines) {
    const matches = numberRegex.exec(line);
    if (!matches) {
      continue;
    }
    const x = Number(matches[1]);
    const y = Number(matches[2]);

    if (line.startsWith("Button A")) {
      currentMachine.buttonA = { deltaCol: x, deltaRow: y };
    } else if (line.startsWith("Button B")) {
      currentMachine.buttonB = { deltaCol: x, deltaRow: y };
    } else {
      currentMachine.prize = { col: x + prizeOffset, row: y + prizeOffset };
      machines.push(currentMachine as Machine);
      currentMachine = {};
    }
  }

  const results: PlayResult[] = [];
  for (const machine of machines) {
    const result = findResult(machine);
    if (
      result &&
      result.a === Math.floor(result.a) &&
      result.b === Math.floor(result.b)
    ) {
      results.push(result);
    }
  }

  const totalTokens = results.reduce(
    (acc, curr) => acc + curr.a * buttonAPrice + curr.b * buttonBPrice,
    0
  );

  return totalTokens;
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input)).toEqual(480);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input)).toEqual(26810);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, 10000000000000)).toEqual(108713182988244);
  });
});
