import { addTwoValues, readToString } from "@palpatim/aoc-utils";
import * as path from "node:path";

const getMiddle = <T>(a: T[]): T | T[] => {
  if (a.length % 2 === 0) {
    return [a[a.length / 2 - 1], a[a.length / 2]];
  } else {
    return a[Math.floor(a.length / 2)];
  }
};

const isCorrectlyOrdered = (
  update: { [key: string]: string },
  rules: { [key: string]: string[] }
): boolean => {
  const rulesComparator = makeRuleComparator(rules);
  const printOrder = sortUpdateByPrintOrder(update);
  const rulesOrder = Object.keys(update).sort(rulesComparator);
  return printOrder.every((page, idx) => page === rulesOrder[idx]);
};

const sortUpdateByPrintOrder = (update: {
  [key: string]: string;
}): string[] => {
  const pages = Object.keys(update);
  const sortedPages = pages.sort((a, b) => {
    return Number(update[a]) - Number(update[b]);
  });
  return sortedPages;
};

const parseInput = (
  input: string
): {
  rules: { [key: string]: string[] };
  updates: { [key: string]: string }[];
} => {
  // Pairs store a page number and a list of pages that it must appear before. Thus:
  //   47|53
  //   97|13
  //   97|61
  // becomes
  // {47: [53], 97: [13, 61]}
  const rules: { [key: string]: string[] } = {};

  // An update will be a record consisting of the page number and the order in which it was printed. Thus:
  // 75,47,61 -> {75: 0, 47: 1, 61: 2}
  const updates: { [key: string]: string }[] = [];
  const lines = input.split("\n");
  for (const line of lines) {
    if (line.includes("|")) {
      const [page, before] = line.split("|");
      if (rules[page]) {
        rules[page].push(before);
      } else {
        rules[page] = [before];
      }
    }

    if (line.includes(",")) {
      const updatePages = line.split(",");
      const update: { [key: string]: string } = {};
      updatePages.forEach((page, idx) => {
        update[page] = `${idx}`;
      });
      updates.push(update);
    }
  }

  return { rules, updates };
};

const solve1 = (input: string): number => {
  const { rules, updates } = parseInput(input);
  const correctUpdates = updates.filter((u) => isCorrectlyOrdered(u, rules));
  const middleValues = correctUpdates
    .map(sortUpdateByPrintOrder)
    .map((pages) => {
      const middle = getMiddle(pages);
      if (Array.isArray(middle)) {
        throw new Error(`Unexpected result: ${pages}`);
      }
      return middle;
    });

  const result = middleValues.map(Number).reduce(addTwoValues, 0);

  return result;
};

const solve2 = (input: string): number => {
  const { rules, updates } = parseInput(input);
  const incorrectUpdates = updates.filter((u) => !isCorrectlyOrdered(u, rules));
  const correctedUpdates = incorrectUpdates.map((u) => correctUpdate(u, rules));
  const middleValues = correctedUpdates.map((pages) => {
    const middle = getMiddle(pages);
    if (Array.isArray(middle)) {
      throw new Error(`Unexpected result: ${pages}`);
    }
    return middle;
  });

  const result = middleValues.map(Number).reduce(addTwoValues, 0);

  return result;
};

const correctUpdate = (
  incorrectUpdate: { [key: string]: string },
  rules: { [key: string]: string[] }
): string[] => {
  const rulesComparator = makeRuleComparator(rules);
  return Object.keys(incorrectUpdate).sort(rulesComparator);
};

const makeRuleComparator = (rules: {
  [key: string]: string[];
}): ((a: string, b: string) => number) => {
  const sortByRule = (a: string, b: string): number => {
    if (rules[a] && rules[a].includes(b)) {
      return -1;
    } else if (rules[b] && rules[b].includes(a)) {
      return 1;
    } else {
      return 0;
    }
  };
  return sortByRule;
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve1(input)).toEqual(143);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve1(input)).toEqual(5651);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve2(input)).toEqual(123);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve2(input)).toEqual(4743);
  });
});
