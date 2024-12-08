import {
  getOffset,
  getPointAtOffset,
  GridIterator,
  isValidPoint,
  keyToPoint,
  pointToKey,
  readToString,
} from "@palpatim/aoc-utils";
import * as path from "node:path";

const symbols = /[A-Za-z0-9]/;
const isSymbol = (char: string) => symbols.test(char);

interface Resonances {
  antennaLocations: string[];
  antinodeLocations: Set<string>;
}

const solve = (input: string, permissive: boolean): number => {
  const lines = input.split("\n");
  const grid = lines.map((line) => line.split(""));
  const gridIter = new GridIterator(grid);
  const resonances: Record<string, Resonances> = {};

  // Populate antenna locations
  let done = false;
  while (!done) {
    const value = gridIter.peek()!;
    if (isSymbol(value)) {
      const antennaLocation = gridIter.currentPoint();
      resonances[value] = resonances[value] || {
        antennaLocations: [],
        antinodeLocations: new Set<string>(),
      };
      resonances[value].antennaLocations.push(pointToKey(antennaLocation));
    }
    gridIter.next();
    done = gridIter.done;
  }

  // Populate antinode locations
  for (const [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _frequency,
    { antennaLocations, antinodeLocations },
  ] of Object.entries(resonances)) {
    for (let i = 0; i < antennaLocations.length; i++) {
      const a = keyToPoint(antennaLocations[i]);
      if (permissive && antennaLocations.length > 1) {
        antinodeLocations.add(pointToKey(a));
      }
      for (let j = i + 1; j < antennaLocations.length; j++) {
        const b = keyToPoint(antennaLocations[j]);
        if (permissive) {
          antinodeLocations.add(pointToKey(b));
        }

        const v = getOffset(a, b);

        // all antinodes along the direction a->b
        let antinodeAb = getPointAtOffset(b, v);
        while (isValidPoint(antinodeAb, grid)) {
          antinodeLocations.add(pointToKey(antinodeAb));
          if (!permissive) {
            break;
          }
          antinodeAb = getPointAtOffset(antinodeAb, v);
        }

        v.deltaRow *= -1;
        v.deltaCol *= -1;
        let antinodeBa = getPointAtOffset(a, v);
        while (isValidPoint(antinodeBa, grid)) {
          antinodeLocations.add(pointToKey(antinodeBa));
          if (!permissive) {
            break;
          }
          antinodeBa = getPointAtOffset(antinodeBa, v);
        }
      }
    }
  }

  const allLocations = Object.values(resonances).flatMap(
    (r) => r.antinodeLocations
  );

  const uniqueLocations = new Set<string>();
  allLocations.forEach((s) => s.forEach((v) => uniqueLocations.add(v)));

  return uniqueLocations.size;
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input, false)).toEqual(14);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, false)).toEqual(254);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input, true)).toEqual(34);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, true)).toEqual(951);
  });
});
