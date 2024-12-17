import { readToString } from "@palpatim/aoc-utils";
import * as path from "node:path";

interface ProgramState {
  instructionPointer: number;
  registers: number[];
  program: number[];
}

/**
 * Abstraction representing an operation that evolves program state
 */
type Operation = (operand: number, state: ProgramState) => number[];

const adv: Operation = (operand: number, state: ProgramState): number[] => {
  state.registers[0] = Math.floor(
    state.registers[0] / Math.pow(2, resolveComboOperand(operand, state))
  );
  state.instructionPointer += 2;
  return [];
};

const bxl: Operation = (operand: number, state: ProgramState): number[] => {
  state.registers[1] = state.registers[1] ^ operand;
  state.instructionPointer += 2;
  return [];
};

const bst: Operation = (operand: number, state: ProgramState): number[] => {
  state.registers[1] = resolveComboOperand(operand, state) % 8;
  state.instructionPointer += 2;
  return [];
};

const jnz: Operation = (operand: number, state: ProgramState): number[] => {
  if (state.registers[0] === 0) {
    state.instructionPointer += 2;
    return [];
  }

  state.instructionPointer = operand;
  return [];
};

const bxc: Operation = (_operand: number, state: ProgramState): number[] => {
  state.registers[1] = state.registers[1] ^ state.registers[2];
  state.instructionPointer += 2;
  return [];
};

const out: Operation = (operand: number, state: ProgramState): number[] => {
  state.instructionPointer += 2;
  return [resolveComboOperand(operand, state) % 8];
};

const bdv: Operation = (operand: number, state: ProgramState): number[] => {
  state.registers[1] = Math.floor(
    state.registers[0] / Math.pow(2, resolveComboOperand(operand, state))
  );
  state.instructionPointer += 2;
  return [];
};

const cdv: Operation = (operand: number, state: ProgramState): number[] => {
  state.registers[2] = Math.floor(
    state.registers[0] / Math.pow(2, resolveComboOperand(operand, state))
  );
  state.instructionPointer += 2;
  return [];
};

const operations: [
  Operation,
  Operation,
  Operation,
  Operation,
  Operation,
  Operation,
  Operation,
  Operation
] = [
  adv, // 0
  bxl, // 1
  bst, // 2
  jnz, // 3
  bxc, // 4
  out, // 5
  bdv, // 6
  cdv, // 7
];

const resolveComboOperand = (operand: number, state: ProgramState): number => {
  if (operand <= 3) {
    return operand;
  } else if (operand === 7) {
    throw new Error(`Invalid operand ${operand}`);
  }
  return state.registers[operand - 4];
};

const parseProgram = (input: string): ProgramState => {
  const [registerStr, programStr] = input.split("\n\n");

  const regexA = /A: (\d+)/;
  const regexB = /B: (\d+)/;
  const regexC = /C: (\d+)/;

  const registers: number[] = [];

  let matches = regexA.exec(registerStr);
  registers.push(Number(matches![1]));

  matches = regexB.exec(registerStr);
  registers.push(Number(matches![1]));

  matches = regexC.exec(registerStr);
  registers.push(Number(matches![1]));

  const programMatch = /: (.*)/.exec(programStr);
  const program = programMatch![1].split(",").map(Number);

  return { instructionPointer: 0, registers, program };
};

const solve = (input: string): string => {
  const state = parseProgram(input);

  const output: number[] = [];
  while (state.instructionPointer < state.program.length) {
    const opcode = state.program[state.instructionPointer];
    const operand = state.program[state.instructionPointer + 1];
    const stepOutput = operations[opcode](operand, state);
    output.push(...stepOutput);
  }
  return output.join(",");
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const clone = (obj: any): any => JSON.parse(JSON.stringify(obj));

const solve2 = (input: string): string => {
  const state = parseProgram(input);
  const originalState = clone(state);

  const output: number[] = [];
  while (state.instructionPointer < state.program.length) {
    const opcode = state.program[state.instructionPointer];
    const operand = state.program[state.instructionPointer + 1];
    const stepOutput = operations[opcode](operand, state);
    output.push(...stepOutput);
  }
  return output.join(",");
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input)).toEqual("4,6,3,5,6,3,5,2,1,0");
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input)).toEqual("3,6,7,0,5,7,3,1,4");
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve2(input)).toEqual(117440);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve2(input)).toEqual(-1);
  });
});
