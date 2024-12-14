import * as path from "node:path";
import {
  getCellAtPoint,
  Grid,
  Offset,
  Point,
  readToString,
} from "@palpatim/aoc-utils";

interface Bot {
  id: number;
  position: Point;
  velocity: Offset;
}

type SolveCondition = Part1SolveCondition | Part2SolveCondition;

type Part1SolveCondition = { type: "part1"; count: number };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPart1 = (obj: any): obj is Part1SolveCondition => obj.type === "part1";

type Part2SolveCondition = {
  type: "part2";

  // For part 2, we're looking for a Christmas tree picture, which includes a
  // solid border around the picture. We'll scan for a solid line of fill
  // characters to act as the flag that we found the picture.
  regex: RegExp;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPart2 = (obj: any): obj is Part2SolveCondition => obj.type === "part2";

const dumpGrid = (grid: Grid<Bot[]>): string => {
  const rows = grid.map((row) =>
    row.map((bots) => (bots.length > 0 ? bots.length : ".")).join("")
  );
  return rows.join("\n");
};

const addBot = (bot: Bot, grid: Grid<Bot[]>) => {
  const { position } = bot;
  const cellContents = getCellAtPoint(position, grid);
  if (!cellContents) {
    throw new Error(`Cell at ${position.row}, ${position.col} does not exist`);
  }

  if (cellContents.some((b) => b.id === bot.id)) {
    throw new Error(
      `Bot ${bot.id} already exists at ${position.row},${position.col}`
    );
  }

  cellContents.push(bot);
};

const removeBot = (bot: Bot, grid: Grid<Bot[]>) => {
  const { position } = bot;

  const cellContents = getCellAtPoint(position, grid);
  if (!cellContents) {
    throw new Error(`Cell at ${position.row}, ${position.col} does not exist`);
  }

  const botIndex = cellContents.findIndex((b) => b.id === bot.id);
  if (botIndex === -1) {
    throw new Error(
      `Bot ${bot.id} does not exist at ${position.row},${position.col}`
    );
  }

  cellContents.splice(botIndex, 1);
};

const moveBot = (bot: Bot, grid: Grid<Bot[]>, count: number = 1) => {
  const {
    position: { row, col },
    velocity: { deltaRow, deltaCol },
  } = bot;

  const totalDeltaRow = deltaRow * count;
  const rawNewRow = (row + totalDeltaRow) % grid.length;

  const totalDeltaCol = deltaCol * count;
  const rawNewCol = (col + totalDeltaCol) % grid[0].length;

  const newRow = rawNewRow >= 0 ? rawNewRow : grid.length + rawNewRow;
  const newCol = rawNewCol >= 0 ? rawNewCol : grid[0].length + rawNewCol;

  const newPosition: Point = {
    row: newRow,
    col: newCol,
  };

  removeBot(bot, grid);

  bot.position = newPosition;

  addBot(bot, grid);
};

const solve = (
  input: string,
  solveCondition: SolveCondition,
  gridDimensions: { rows: number; cols: number }
): number => {
  const lines = input.split("\n");
  const numRegex = /(-?\d+),(-?\d+).*?(-?\d+),(-?\d+)/g;

  const grid: Grid<Bot[]> = Array.from({ length: gridDimensions.rows }, () =>
    Array.from({ length: gridDimensions.cols }, () => [])
  );

  // Used for part 2 to keep track of the populated cells
  const states: string[] = [];

  const allBots: Bot[] = [];
  lines.forEach((line, idx) => {
    numRegex.lastIndex = 0;
    const matches = numRegex.exec(line);
    const [col, row, deltaCol, deltaRow] = matches!.slice(1, 5).map(Number);
    const position: Point = { row, col };
    const bot: Bot = { id: idx, position, velocity: { deltaRow, deltaCol } };
    addBot(bot, grid);
    allBots.push(bot);
  });

  let iteration = 0;
  while (true) {
    if (isPart1(solveCondition)) {
      allBots.forEach((bot) => moveBot(bot, grid, 100));
      break;
    }

    const state = dumpGrid(grid);
    states.push(state);

    if (isPart2(solveCondition)) {
      if (state.match(solveCondition.regex)) {
        break;
      }

      if (iteration > 50000) {
        throw new Error("Too many iterations for part 2");
      }
    }

    allBots.forEach((bot) => moveBot(bot, grid));

    iteration += 1;
  }

  if (isPart1(solveCondition)) {
    const gridCenter = {
      row: Math.floor(gridDimensions.rows / 2),
      col: Math.floor(gridDimensions.cols / 2),
    };

    // Calculate safety factor
    let q1Count = 0;
    let q2Count = 0;
    let q3Count = 0;
    let q4Count = 0;

    allBots.forEach((bot) => {
      const {
        position: { row, col },
      } = bot;

      if (row < gridCenter.row && col < gridCenter.col) {
        q1Count += 1;
      } else if (row < gridCenter.row && col > gridCenter.col) {
        q2Count += 1;
      } else if (row > gridCenter.row && col < gridCenter.col) {
        q3Count += 1;
      } else if (row > gridCenter.row && col > gridCenter.col) {
        q4Count += 1;
      }
    });

    return q1Count * q2Count * q3Count * q4Count;
  } else {
    console.log(`Iteration ${iteration}\n${dumpGrid(grid)}`);
    return iteration;
  }
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(
      solve(input, { type: "part1", count: 100 }, { rows: 7, cols: 11 })
    ).toEqual(12);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(
      solve(input, { type: "part1", count: 100 }, { rows: 103, cols: 101 })
    ).toEqual(217328832);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(
      solve(
        input,
        { type: "part2", regex: new RegExp(/\d{10}/gm) },
        { rows: 103, cols: 101 }
      )
    ).toEqual(7412);
  });
});
