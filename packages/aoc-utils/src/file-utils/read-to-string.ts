import * as fs from "node:fs";

export const readToString = (pathStr: string): string => {
  const input = fs.readFileSync(pathStr).toString();
  return input;
};
