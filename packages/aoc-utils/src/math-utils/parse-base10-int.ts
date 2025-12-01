/**
 * A functional version of `parseInt` using base 10 as a radix
 */
export const parseBase10Int = (s: string): number => parseInt(s, 10);

/**
 * Strips all non-numeric or decimal characters from a string
 */
export const stripNonNumeric = (s: string): string => s.replace(/[^0-9.]/, "");