import { readToString } from "@palpatim/aoc-utils";
import * as path from "node:path";

const solve = (input: string): number => {
  const fileMap = input.trim().split("").map(Number);

  const fileSystem: number[] = [];
  let fileIdx = 0;
  for (let i = 0; i < fileMap.length; i++) {
    const mapEntry = fileMap[i];
    const isFile = i % 2 === 0;
    const blockValue = isFile ? fileIdx++ : NaN;
    const blocks = Array(mapEntry).fill(blockValue);
    fileSystem.push(...blocks);
  }

  let startIdx = 0;
  let endIdx = fileSystem.length - 1;
  while (endIdx > startIdx) {
    // Find the first element to move, starting from the end
    let block = fileSystem[endIdx];
    while (isNaN(block)) {
      endIdx--;
      block = fileSystem[endIdx];
    }

    if (endIdx <= startIdx) {
      break;
    }

    // Find the first empty space to move the block to, starting from the start
    let emptySpace = fileSystem[startIdx];
    while (!isNaN(emptySpace)) {
      startIdx++;
      emptySpace = fileSystem[startIdx];
    }

    if (startIdx >= endIdx) {
      break;
    }

    // Move the block to the empty space
    fileSystem[startIdx] = block;
    fileSystem[endIdx] = NaN;
  }

  let result = 0;
  for (let i = 0; i < fileSystem.length; i++) {
    if (isNaN(fileSystem[i])) {
      break;
    }
    result += fileSystem[i] * i;
  }
  return result;
};

interface FsMapEntry {
  type: "file" | "emptySpace";

  /** NaN = empty space; number == fileId of file */
  fileId: number;

  /** Number of blocks */
  size: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEmptySpace = (entry: any): entry is { type: "emptySpace" } =>
  entry.type === "emptySpace";

const solveDefrag = (input: string): number => {
  const fileMap = input.trim().split("").map(Number);

  const fileSystem: FsMapEntry[] = fileMap.map((entry, idx) => ({
    type: idx % 2 === 0 ? "file" : "emptySpace",
    fileId: idx % 2 === 0 ? idx / 2 : NaN,
    size: entry,
  }));

  let endIdx = fileSystem.length - 1;
  while (endIdx > 0) {
    // Find the first element to move, starting from the end
    let fileBlock = fileSystem[endIdx];
    while (isEmptySpace(fileBlock)) {
      endIdx -= 1;
      fileBlock = fileSystem[endIdx];
    }

    if (endIdx <= 0) {
      break;
    }

    // Find index of first empty space block that can contain `file`
    const emptySpaceIndex = fileSystem.findIndex(
      (block) => isEmptySpace(block) && block.size >= fileBlock.size
    );

    if (emptySpaceIndex === -1 || emptySpaceIndex > endIdx) {
      endIdx -= 1;
      continue;
    }

    const emptySpaceBlock = fileSystem[emptySpaceIndex];

    const remainingEmptySpace = emptySpaceBlock.size - fileBlock.size;
    if (remainingEmptySpace < 0) {
      // Should never happen, as long as I didn't write a bug...
      throw new Error("remainingEmptySpace < 0");
    }

    // Move the block to the empty space
    fileSystem[emptySpaceIndex] = fileBlock;

    // Old position of file is now empty space
    fileSystem.splice(endIdx, 1, {
      type: "emptySpace",
      fileId: NaN,
      size: fileBlock.size,
    });

    // Re-map remaining empty space, if any
    if (remainingEmptySpace > 0) {
      const remainingEmptySpaceBlock = {
        type: "emptySpace",
        fileId: NaN,
        size: remainingEmptySpace,
      } as const;
      fileSystem.splice(emptySpaceIndex + 1, 0, remainingEmptySpaceBlock);
    }

    endIdx -= 1;
  }

  let result = 0;
  let fsIdx = 0;
  for (const block of fileSystem) {
    if (isEmptySpace(block)) {
      fsIdx += block.size;
      continue;
    }

    const endIdx = fsIdx + block.size;
    while (fsIdx < endIdx) {
      result += fsIdx * block.fileId;
      fsIdx += 1;
    }
  }
  return result;
};

describe("aoc", () => {
  test("sample", () => {
    const input = "12345";
    expect(solve(input)).toEqual(60);
  });

  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input)).toEqual(1928);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input)).toEqual(6291146824486);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solveDefrag(input)).toEqual(2858);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solveDefrag(input)).toEqual(6307279963620);
  });
});
