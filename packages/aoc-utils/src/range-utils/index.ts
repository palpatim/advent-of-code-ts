import { parseBase10Int } from "../math-utils/parse-base10-int";

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

  static fromDelimitedString = (
    input: string,
    delimiter: string = "-"
  ): ClosedRange => {
    const [lower, upper] = input.split(delimiter).map(parseBase10Int);
    return new ClosedRange(lower, upper);
  };

  [Symbol.iterator](): Iterator<number> {
    return new ClosedRangeIterator(this);
  }

  /**
   * Returns true if the given element is contained within the receiver,
   * inclusive.
   */
  contains = (el: number): boolean => {
    return this.lower <= el && el <= this.upper;
  };

  /**
   * Returns a new range that is the union of the receiver and the given range.
   */
  merge = (other: ClosedRange): ClosedRange => {
    return new ClosedRange(
      Math.min(this.lower, other.lower),
      Math.max(this.upper, other.upper)
    );
  };

  /**
   * Returns true if any element of the receiver overlaps with the given range.
   */
  overlaps = (other: ClosedRange): boolean => {
    return (
      this.contains(other.lower) ||
      this.contains(other.upper) ||
      other.contains(this.lower) ||
      other.contains(this.upper)
    );
  };

  /**
   * Returns the number of elements in the range.
   */
  size = (): number => this.upper - this.lower + 1;
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

export const rangeComparator = (a: ClosedRange, b: ClosedRange): number => {
  if (a.lower < b.lower) {
    return -1;
  } else if (a.lower > b.lower) {
    return 1;
  } else {
    return a.upper - b.upper;
  }
};
