import { Point } from "./point";

/**
 * A custom IteratorResult that includes the point at which the current result was generated.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GridIteratorResult<T, TReturn = any> =
  | GridIteratorYieldResult<T>
  | GridIteratorReturnResult<TReturn>;

export type GridIteratorYieldResult<TYield> = IteratorYieldResult<TYield> & {
  point: Point;
};

export type GridIteratorReturnResult<TReturn> =
  IteratorReturnResult<TReturn> & {
    point: Point;
  };
