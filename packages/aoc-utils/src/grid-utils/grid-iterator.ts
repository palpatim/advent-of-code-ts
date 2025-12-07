import { getCellAtPoint, Grid } from "./grid";
import { Point } from "./point";

/**
 * Implements an Iterator over a Grid that returns a struct containing a point
 * and the grid's value at that point.
 */
export class GridIterator<T> {
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

  get done(): boolean {
    return this.row >= this.grid.length;
  }

  get currentPoint(): Point {
    return { row: this.row, col: this.col };
  }

  get currentValue(): T | undefined {
    return getCellAtPoint(this.currentPoint, this.grid)!;
  }

  next = (count: number = 1): IteratorResult<GridIteratorResult<T>> => {
    if (count < 1) {
      throw new Error("Count must be greater than 0");
    }

    let result: IteratorResult<GridIteratorResult<T>>;
    for (let i = 0; i < count; i++) {
      result = this._next();
    }
    return result!;
  };

  peek = (): GridIteratorResult<T> | undefined => {
    if (this.done) {
      return undefined;
    }
    return { value: this.currentValue!, point: this.currentPoint };
  };

  map = <U>(mapper: (v: T) => U): U[] => {
    const result: U[] = [];
    for (const nextValue of this) {
      result.push(mapper(nextValue.value));
    }
    return result;
  };

  filter = (pred: (v: T) => boolean): T[] => {
    const result: T[] = [];
    for (const nextValue of this) {
      if (pred(nextValue.value)) {
        result.push(nextValue.value);
      }
    }
    return result;
  };

  find = (pred: (v: T) => boolean): T | undefined => {
    for (const nextValue of this) {
      if (pred(nextValue.value)) {
        return nextValue.value;
      }
    }
    return undefined;
  };

  findResult = (
    pred: (R: GridIteratorResult<T>) => boolean
  ): GridIteratorResult<T> | undefined => {
    for (const nextValue of this) {
      if (pred(nextValue)) {
        return nextValue;
      }
    }
    return undefined;
  };

  some = (pred: (v: T) => boolean): boolean => {
    for (const nextValue of this) {
      if (pred(nextValue.value)) {
        return true;
      }
    }
    return false;
  };

  every = (pred: (v: T) => boolean): boolean => {
    for (const nextValue of this) {
      if (!pred(nextValue.value)) {
        return false;
      }
    }
    return true;
  };

  reset = (): void => {
    this.row = 0;
    this.col = 0;
  };

  _next = (): IteratorResult<GridIteratorResult<T>> => {
    if (this.row >= this.grid.length) {
      return { done: true, value: undefined };
    }

    const point = this.currentPoint;
    const value = this.currentValue!;

    this.col++;
    if (this.col >= this.grid[this.row].length) {
      this.row++;
      this.col = 0;
    }

    return { done: false, value: { value, point } };
  };
}

/**
 * Encapsulating iteration results that include both the current point and the
 * value at that point.
 */
export interface GridIteratorResult<T> {
  value: T;
  point: Point;
}
