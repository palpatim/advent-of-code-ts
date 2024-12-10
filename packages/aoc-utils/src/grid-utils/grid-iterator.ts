import { getCellAtPoint, Grid, isValidPoint } from "./grid";
import { GridIteratorResult } from "./grid-iterator-result";
import { Point } from "./point";

export class GridIterator<T> implements Iterable<T> {
  grid: Grid<T>;
  row: number;
  col: number;
  done: boolean;

  constructor(grid: Grid<T>) {
    this.grid = grid;
    this.row = 0;
    this.col = 0;
    this.done = false;
  }

  [Symbol.iterator] = (): GridIterator<T> => {
    return this;
  };

  next = (count: number = 1): GridIteratorResult<T> => {
    if (count < 1) {
      throw new Error("Count must be greater than 0");
    }

    let i = 0;
    let result: GridIteratorResult<T>;
    for (; i < count; i++) {
      result = this._next();
      if (result.done) {
        break;
      }
    }
    return result!;
  };

  private _next(): GridIteratorResult<T> {
    const currentPoint = this.currentPoint();
    if (!isValidPoint(currentPoint, this.grid)) {
      this.done = true;
      return { done: this.done, value: undefined, point: currentPoint };
    }
    const value = this.grid[this.row][this.col];
    this.col++;
    if (this.col >= this.grid[this.row].length) {
      this.col = 0;
      this.row++;
    }
    return { done: this.done, value, point: currentPoint };
  }
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

  find = (pred: (v: T) => boolean): T | undefined => {
    while (!this.done) {
      const value = getCellAtPoint(this.currentPoint(), this.grid)!;
      if (pred(value)) {
        this.next();
        return value;
      }
      this.next();
    }
    return undefined;
  };

  /**
   * Advances iterator until `pred` is true or end of grid is reached. Returns a
   * GridIteratorResult describing the cell that satisfies `pred`, or a `done`
   * result if no such cell exists.
   */
  findIndex = (pred: (v: T) => boolean): GridIteratorResult<T> => {
    while (!this.done) {
      const value = getCellAtPoint(this.currentPoint(), this.grid)!;
      if (pred(value)) {
        const result = { value, done: this.done, point: this.currentPoint() };
        this.next();
        return result;
      }
      this.next();
    }
    return { done: true, value: undefined, point: this.currentPoint() };
  };
}
