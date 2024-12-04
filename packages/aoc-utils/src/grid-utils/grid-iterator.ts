import { Grid, isValidPoint } from "./grid";
import { GridIteratorResult } from "./grid-iterator-result";
import { Point } from "./point";

export class GridIterator<T> implements Iterable<T> {
  grid: Grid<T>;
  row: number;
  col: number;

  constructor(grid: Grid<T>) {
    this.grid = grid;
    this.row = 0;
    this.col = 0;
  }

  [Symbol.iterator] = (): GridIterator<T> => {
    return this;
  };

  next = (): GridIteratorResult<T> => {
    const currentPoint = this.currentPoint();
    if (!isValidPoint(currentPoint, this.grid)) {
      return { done: true, value: undefined, point: currentPoint };
    }
    const value = this.grid[this.row][this.col];
    this.col++;
    if (this.col >= this.grid[this.row].length) {
      this.col = 0;
      this.row++;
    }
    return { done: false, value, point: currentPoint };
  };

  peek = (): T | undefined => {
    if (isValidPoint({ row: this.row, col: this.col }, this.grid)) {
      return this.grid[this.row][this.col];
    }
    return undefined;
  };

  currentPoint = (): Point => {
    return { row: this.row, col: this.col };
  };

  map = <U>(mapper: (v: T) => U): U[] => {
    const result: U[] = [];
    for (const value of this) {
      result.push(mapper(value));
    }
    return result;
  };

  filter = (pred: (v: T) => boolean): T[] => {
    const result: T[] = [];
    for (const value of this) {
      if (pred(value)) {
        result.push(value);
      }
    }
    return result;
  };
}
