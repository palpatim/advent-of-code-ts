import { Grid, isValidPoint } from "./grid";
import { GridIterator, GridIteratorResult } from "./grid-iterator";
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
export class GridOffsetIterator<T> extends GridIterator<T> {
  start: Point;
  offset: NamedOffset;
  _done: boolean;

  constructor(grid: Grid<T>, start: Point, offset: NamedOffset) {
    super(grid);
    this.start = start;
    this.offset = offset;
    this.row = start.row;
    this.col = start.col;
    this._done = false;
  }

  [Symbol.iterator] = (): GridOffsetIterator<T> => {
    return this;
  };

  get done(): boolean {
    return this._done;
  }

  _next = (): IteratorResult<GridIteratorResult<T>> => {
    const currentPoint = this.currentPoint;
    if (!isValidPoint(currentPoint, this.grid)) {
      this._done = true;
      return { done: true, value: undefined };
    }
    const value = this.currentValue!;
    const point = this.currentPoint;
    const nextPoint = getPointAtOffset(currentPoint, this.offset);
    this.row = nextPoint.row;
    this.col = nextPoint.col;
    return { done: false, value: { value, point } };
  };

  reset = () => {
    this.col = this.start.col;
    this.row = this.start.row;
  };
}
