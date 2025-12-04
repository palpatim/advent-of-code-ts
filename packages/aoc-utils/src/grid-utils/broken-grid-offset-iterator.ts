import { Grid, isValidPoint } from "./grid";
import { BrokenGridIterator } from "./broken-grid-iterator";
import { BrokenGridIteratorResult } from "./broken-grid-iterator-result";
import { NamedOffset, getPointAtOffset } from "./offset";
import { Point } from "./point";

/**
 * Implements an iterator over each cell of a grid in the specified offset
 * direction from a given starting point. Thus, given a grid:
 *
 *     123
 *     456
 *     789
 *
 * an offset of "S", and a starting point of {0,0} the iterator will return the
 *     cells in the order: 1, 4, 7
 */
export class BrokenGridOffsetIterator<T> extends BrokenGridIterator<T> {
  offset: NamedOffset;

  constructor(grid: Grid<T>, start: Point, offset: NamedOffset) {
    super(grid);
    this.offset = offset;
    this.row = start.row;
    this.col = start.col;
  }

  [Symbol.iterator] = (): BrokenGridOffsetIterator<T> => {
    return this;
  };

  next = (): BrokenGridIteratorResult<T> => {
    const currentPoint = this.currentPoint();
    if (!isValidPoint(currentPoint, this.grid)) {
      return { done: true, value: undefined, point: currentPoint };
    }
    const value = this.grid[this.row][this.col];
    const nextPoint = getPointAtOffset(currentPoint, this.offset);
    this.row = nextPoint.row;
    this.col = nextPoint.col;
    return { done: false, value, point: currentPoint };
  };
}
