import { Point } from "./point";

/**
 * A custom IteratorResult that includes the point at which the current result was generated.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GridIteratorResult<T, TReturn = any> = IteratorResult<
  T,
  TReturn
> & { point: Point };
