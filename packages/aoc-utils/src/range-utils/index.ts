/**
 * A closed range--that is, a range that comprises the elements starting at and
 * including `lower`, up to AND including `upper`.
 *
 * Because of this, a range constructed with `lower == upper` is a valid
 * one-element range.
 */
export class ClosedRange {
  readonly lower: number;
  readonly upper: number;

  constructor(lower: number, upper: number) {
    if (lower > upper) {
      throw new Error(`lower (${lower}) must be <= upper (${upper})`);
    }
    this.lower = lower;
    this.upper = upper;
  }

  contains = (el: number): boolean => {
    return this.lower <= el && el <= this.upper;
  };

  [Symbol.iterator](): Iterator<number> {
    return new ClosedRangeIterator(this);
  }
}

class ClosedRangeIterator {
  private current: number;
  private readonly upper: number;

  constructor(range: ClosedRange) {
    this.current = range.lower;
    this.upper = range.upper;
  }

  next(): IteratorResult<number> {
    if (this.current > this.upper) {
      return { done: true, value: undefined };
    } else {
      return { done: false, value: this.current++ };
    }
  }

  [Symbol.iterator](): Iterator<number> {
    return this;
  }
}
