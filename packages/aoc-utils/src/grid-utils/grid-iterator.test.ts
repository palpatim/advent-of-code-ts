import { GridIterator } from "./grid-iterator";
import { getGrid } from "./grid-test-utils";

describe("GridIterator", () => {
  test("handles simple case", () => {
    const expectedResults = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const iterator = new GridIterator(getGrid());
    expect(iterator.next().value).toEqual(expectedResults.shift());
    expect(iterator.next().value).toEqual(expectedResults.shift());
    expect(iterator.next().value).toEqual(expectedResults.shift());
    expect(iterator.next().value).toEqual(expectedResults.shift());
    expect(iterator.next().value).toEqual(expectedResults.shift());
    expect(iterator.next().value).toEqual(expectedResults.shift());
    expect(iterator.next().value).toEqual(expectedResults.shift());
    expect(iterator.next().value).toEqual(expectedResults.shift());
    expect(iterator.next().value).toEqual(expectedResults.shift());
    expect(iterator.next().done).toBeTruthy();
  });

  test("supports for-in iteration", () => {
    let expectedResult = 0;
    const iter = new GridIterator(getGrid());
    for (const result of iter) {
      expect(result).toBe(expectedResult++);
    }
  });

  test("peek", () => {
    const iterator = new GridIterator(getGrid());
    expect(iterator.peek()).toBe(0);
    expect(iterator.next().value).toBe(0);
    expect(iterator.peek()).toBe(1);
  });

  test("currentPoint", () => {
    const iterator = new GridIterator(getGrid());
    expect(iterator.currentPoint()).toEqual({ row: 0, col: 0 });
    iterator.next();
    expect(iterator.currentPoint()).toEqual({ row: 0, col: 1 });
  });

  test("GridIterableResult contains point", () => {
    const iterator = new GridIterator(getGrid());
    expect(iterator.next().point).toEqual({ row: 0, col: 0 });
    expect(iterator.next().point).toEqual({ row: 0, col: 1 });
  });

  test("filter", () => {
    const iterator = new GridIterator(getGrid());
    const result = iterator.filter((value) => value % 3 === 0);
    expect(result).toEqual([0, 3, 6]);
  });

  test("map", () => {
    const iterator = new GridIterator(getGrid());
    const result = iterator.map((value) => value + 1);
    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
