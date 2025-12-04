import { Grid } from "./grid";
import { Point } from "./point";

/**
 * Implements an Iterator over a Grid that returns a struct containing a point
 * and the grid's value at that point.
 */
export class PointableGridIterator<T> {
  grid: Grid<T>;
  row: number;
  col: number;

  constructor(grid: Grid<T>) {
    this.grid = grid;
    this.row = 0;
    this.col = 0;
  }

  [Symbol.iterator] = (): PointableGridIterator<T> => {
    return this;
  };

  next = (): IteratorResult<PointableResult<T>> => {
    if (this.row >= this.grid.length) {
      return { done: true, value: undefined };
    }

    const point = {
      row: this.row,
      col: this.col,
    };
    const value = this.grid[this.row][this.col];

    this.col++;
    if (this.col >= this.grid[this.row].length) {
      this.row++;
      this.col = 0;
    }

    return { done: false, value: { value, point } };
  };
}

export interface PointableResult<T> {
  value: T;
  point: Point;
}
