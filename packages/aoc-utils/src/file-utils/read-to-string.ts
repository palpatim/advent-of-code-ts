import * as fs from "node:fs";

/**
 * Synchronously reads the file at `pathStr` into a string
 */
export const readToString = (pathStr: string): string => {
  const input = fs.readFileSync(pathStr).toString();
  return input;
};
