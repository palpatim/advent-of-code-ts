import { GridOffsetIterator } from "./grid-offset-iterator";
import { getGrid, getOrigin } from "./grid-test-utils";

describe("GridOffsetIterator", () => {
  test("handles simple case", () => {
    const expectedResults = [0, 3, 6];
    const iterator = new GridOffsetIterator(getGrid(), getOrigin(), "S");
    expect(iterator.next().value.value).toEqual(expectedResults.shift());
    expect(iterator.next().value.value).toEqual(expectedResults.shift());
    expect(iterator.next().value.value).toEqual(expectedResults.shift());
    expect(iterator.next().done).toBeTruthy();
  });

  test("supports for-in iteration", () => {
    const expectedResults = [0, 3, 6];
    const iter = new GridOffsetIterator(getGrid(), getOrigin(), "S");
    for (const result of iter) {
      expect(result.value).toBe(expectedResults.shift());
    }
  });

  test("peek", () => {
    const iterator = new GridOffsetIterator(getGrid(), getOrigin(), "S");
    expect(iterator.peek()?.value).toBe(0);
    expect(iterator.next().value.value).toBe(0);
    expect(iterator.peek()?.value).toBe(3);
  });

  test("currentPoint", () => {
    const iterator = new GridOffsetIterator(getGrid(), getOrigin(), "S");
    expect(iterator.currentPoint).toEqual({ row: 0, col: 0 });
    iterator.next();
    expect(iterator.currentPoint).toEqual({ row: 1, col: 0 });
  });

  test("GridIterableResult contains point", () => {
    const iterator = new GridOffsetIterator(getGrid(), getOrigin(), "S");
    expect(iterator.next().value.point).toEqual({ row: 0, col: 0 });
    expect(iterator.next().value.point).toEqual({ row: 1, col: 0 });
  });

  test("handles invalid starting point", () => {
    const iterator = new GridOffsetIterator(
      getGrid(),
      { row: -1, col: 0 },
      "S"
    );
    expect(iterator.next().done).toBeTruthy();
  });

  test("filter", () => {
    const iterator = new GridOffsetIterator(getGrid(), getOrigin(), "S");
    const result = iterator.filter((value) => value < 4);
    expect(result).toEqual([0, 3]);
  });

  test("map", () => {
    const iterator = new GridOffsetIterator(getGrid(), getOrigin(), "S");
    const result = iterator.map((value) => value + 1);
    expect(result).toEqual([1, 4, 7]);
  });
});
