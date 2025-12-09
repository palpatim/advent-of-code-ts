import {
  multiplyTwoValues,
  Point,
  readToString,
  union,
} from "@palpatim/aoc-utils";
import * as path from "node:path";

type Point3D = [number, number, number];

const point3dToKey = (p: Point3D): string => p.join(",");
const keyToPoint3D = (key: string): Point3D =>
  key.split(",").map(Number) as Point3D;

/**
 * Convert a pair of points into a normalized key
 */
const pairToKey = (pair: [Point3D, Point3D]): string => {
  const keyA = point3dToKey(pair[0]);
  const keyB = point3dToKey(pair[1]);
  const key = [keyA, keyB].sort().join("-");
  return key;
};

const dist3D = (a: Point3D, b: Point3D): number =>
  Math.sqrt(
    Math.pow(a[0] - b[0], 2) +
      Math.pow(a[1] - b[1], 2) +
      Math.pow(a[2] - b[2], 2)
  );

/**
 * Store distance pairs as `{ "<point1Key>-<point2Key>": distance }`
 */
const allDistances: Record<string, number> = {};

const populateAllDistances = (volume: Point3D[]) => {
  for (let i = 0; i < volume.length; i++) {
    const a = volume[i];
    for (let j = i + 1; j < volume.length; j++) {
      const b = volume[j];
      const key = pairToKey([a, b]);
      const abDist = dist3D(a, b);
      allDistances[key] = abDist;
    }
  }
};

const pairDist = (pairKey: string): number => {
  return allDistances[pairKey];
};

const pairComparator = (pairAKey: string, pairBKey: string): number => {
  return pairDist(pairAKey) - pairDist(pairBKey);
};

const solve = (input: string, count: number | undefined): number => {
  const volume: Point3D[] = [];
  const lines = input.split("\n");
  for (const line of lines) {
    const strings = line.split(",");
    const nums = strings.map(Number);
    volume.push([nums[0], nums[1], nums[2]]);
  }

  populateAllDistances(volume);

  if (count && count > Object.keys(allDistances).length) {
    throw new Error("Count may not exceed number of pairs");
  }

  const sortedPairs = Object.keys(allDistances).sort(pairComparator);

  // Each element of the array is a set of junction boxes
  const circuits: Set<string>[] = [];

  let iterations = 0;
  for (const currentPair of sortedPairs) {
    if (count && iterations >= count) {
      break;
    }
    const [a, b] = currentPair.split("-");
    const aIdx = circuits.findIndex((circuit) => circuit.has(a));
    const bIdx = circuits.findIndex((circuit) => circuit.has(b));

    iterations += 1;
    if (aIdx >= 0 && bIdx >= 0 && aIdx === bIdx) {
      // Skip if BOTH items are already in the circuit
      continue;
    } else if (aIdx >= 0 && bIdx >= 0) {
      // The boxes are in two different circuits, so merge them
      const combined = union(circuits[aIdx], circuits[bIdx]);
      // Update the list of circuits
      circuits[aIdx] = combined;
      circuits.splice(bIdx, 1);
    } else if (aIdx >= 0) {
      // a is already in a circuit, so add b to it
      circuits[aIdx].add(b);
    } else if (bIdx >= 0) {
      // b is already in a circuit, so add a to it
      circuits[bIdx].add(a);
    } else {
      // neither are in a circuit, so create a new circuit
      circuits.push(new Set([a, b]));
    }

    // return condition for part 2
    if (circuits.length === 1 && circuits[0].size === volume.length) {
      const aPoint = keyToPoint3D(a);
      const bPoint = keyToPoint3D(b);
      return aPoint[0] * bPoint[0];
    }
  }

  const largestCircuits = circuits.sort((a, b) => b.size - a.size);

  const result = largestCircuits
    .slice(0, 3)
    .map((c) => c.size)
    .reduce(multiplyTwoValues, 1);

  return result;
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input, 10)).toEqual(40);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, 1000)).toEqual(75582);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input, undefined)).toEqual(25272);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, undefined)).toEqual(59039696);
  });
});
