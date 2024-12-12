import {
  addTwoValues,
  getCellAtPoint,
  getPointAtOffset,
  GridIterator,
  isValidPoint,
  keyToPoint,
  NamedOffset,
  Point,
  pointToKey,
  readToString,
  zip,
} from "@palpatim/aoc-utils";
import * as path from "node:path";

const candidateOffsets: NamedOffset[] = ["N", "E", "S", "W"];

// Perimeter key is constructed to allow sorting:
// {H|V}|{coord1}|{offset}|{coord2}
// - H | V : Indicates whether this is a horizontal or vertical perimeter
//   segment
// - Offset : Indicates which side of the region this perimeter segment is on
// - coord1: the `row` of the point for horizontal perimeters; the `col` of the
//   point for vertical perimeters
// - coord2: the `col` of the point for horizontal perimeters; the `row` of the
//   point for vertical perimeters
//
// Thus:
// {0,0}, "N" -> "H|0|N|0"
// {0,0}, "W" -> "V|0|W|0"
// {0,1}, "N" -> "H|0|N|1"
// {0,2}, "N" -> "H|0|N|2"
// {0,3}, "N" -> "H|0|N|3"
// {1,0}, "W" -> "V|0|W|1"
// {1,0}, "S" -> "V|1|S|0"
const getPerimeterKey = (a: Point, offset: NamedOffset): string => {
  if (offset === "N" || offset === "S") {
    return `H|${a.row}|${offset}|${a.col}`;
  } else {
    return `V|${a.col}|${offset}|${a.row}`;
  }
};

const comparePerimeterKeys = (a: string, b: string): number => {
  const [aHorizOrVert, aCoord1, aOffset, aCoord2] = a.split("|");
  const [bHorizOrVert, bCoord1, bOffset, bCoord2] = b.split("|");

  if (aHorizOrVert !== bHorizOrVert) {
    return aHorizOrVert === "V" ? -1 : 1;
  }

  if (aCoord1 !== bCoord1) {
    return Number(aCoord1) - Number(bCoord1);
  }

  if (aOffset !== bOffset) {
    if (aHorizOrVert === "H") {
      return aOffset === "N" ? -1 : 1;
    } else {
      return aOffset === "W" ? -1 : 1;
    }
  }

  return Number(aCoord2) - Number(bCoord2);
};

// Given a perimeter key like "V|0|W|1", returns {head: "V|0|W", coord: 1}. This
// helps side counting detect contiguous ranges
const perimeterKeyToSegmentComparator = (
  key: string
): { head: string; coord: number } => {
  const components = key.split("|");
  return {
    head: components.slice(0, 3).join("|"),
    coord: Number(components[3]),
  };
};

const solve = (input: string, countSides: boolean = false): number => {
  const grid = input.split("\n").map((line) => line.split(""));

  // Build regions
  const visited = new Set<string>();
  const gridIter = new GridIterator(grid);
  let done = false;
  const regions: Set<string>[] = [];
  const perimeters: Set<string>[] = [];

  while (!done) {
    let currentPoint = gridIter.currentPoint();
    let currentKey = pointToKey(currentPoint);

    done = gridIter.next().done!;
    if (visited.has(currentKey) || done) {
      continue;
    }

    const currentRegion = new Set<string>();
    const currentPerimeter = new Set<string>();
    const stack: string[] = [currentKey];
    const currentValue = getCellAtPoint(currentPoint, grid)!;

    while (stack.length > 0) {
      currentKey = stack.pop()!;
      currentRegion.add(currentKey);
      visited.add(currentKey);
      currentPoint = keyToPoint(currentKey);

      for (const offset of candidateOffsets) {
        const candidate = getPointAtOffset(currentPoint, offset);
        const perimeterKey = getPerimeterKey(currentPoint, offset);
        if (!isValidPoint(candidate, grid)) {
          currentPerimeter.add(perimeterKey);
          continue;
        }

        const candidateValue = getCellAtPoint(candidate, grid)!;
        if (candidateValue === currentValue) {
          const candidateKey = pointToKey(candidate);
          if (!visited.has(candidateKey)) {
            stack.push(candidateKey);
          }
        } else {
          currentPerimeter.add(perimeterKey);
        }
      }
    }
    regions.push(currentRegion);
    perimeters.push(currentPerimeter);
  }

  if (countSides) {
    const sideCounts: number[] = [];
    for (const perimeter of perimeters) {

      const segments = Array.from(perimeter)
        .sort(comparePerimeterKeys);

      let prevSegment = segments[0];
      let currentSides = 1;
      for (const segment of segments.slice(1)) {
        const prevComparator = perimeterKeyToSegmentComparator(prevSegment);
        const currentComparator = perimeterKeyToSegmentComparator(segment);
        if (prevComparator.head !== currentComparator.head) {
          currentSides += 1;
        } else {
          if (currentComparator.coord - prevComparator.coord !== 1) {
            currentSides += 1;
          }
        }
        prevSegment = segment;
      }
      sideCounts.push(currentSides);
    }

    const price = zip(regions, sideCounts)
      .map(([region, sideCount]) => {
        const area = region.size;
        return area * sideCount;
      })
      .reduce(addTwoValues, 0);

    return price;
  } else {
    const price = zip(regions, perimeters)
      .map(([region, perimeter]) => {
        const area = region.size;
        const perimeterCount = perimeter.size;
        return area * perimeterCount;
      })
      .reduce(addTwoValues, 0);

    return price;
  }
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input)).toEqual(1930);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input)).toEqual(1434856);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input, true)).toEqual(1206);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, true)).toEqual(891106);
  });
});
