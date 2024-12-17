import { readToString } from "@palpatim/aoc-utils";
import * as path from "node:path";

interface ProgramState {
  instructionPointer: number;
  registers: bigint[];
  program: number[];
}

const BIGINT_ZERO = () => BigInt(0);

/**
 * Abstraction representing an operation that evolves program state
 */
type Operation = (operand: bigint, state: ProgramState) => bigint[];

const adv: Operation = (operand: bigint, state: ProgramState): bigint[] => {
  const comboOp = resolveComboOperand(operand, state);
  // console.log(`adv: A = A / 2**${comboOp}`);

  const result = state.registers[0] / BigInt(2) ** comboOp;

  if (result < 0) {
    throw new Error(`${result} < 0: adv(${operand}); ${JSON.stringify(state)}`);
  }

  state.registers[0] = result;
  state.instructionPointer += 2;
  return [];
};

const bxl: Operation = (operand: bigint, state: ProgramState): bigint[] => {
  // console.log(`bxl: B = B^${operand}`);

  const result = state.registers[1] ^ operand;

  if (result < 0) {
    throw new Error(`${result} < 0: bxl(${operand}); ${JSON.stringify(state)}`);
  }

  state.registers[1] = result;
  state.instructionPointer += 2;
  return [];
};

const bst: Operation = (operand: bigint, state: ProgramState): bigint[] => {
  const comboOp = resolveComboOperand(operand, state);
  // console.log(`bst: B = ${comboOp} % 8`);

  const result = comboOp % BigInt(8);

  if (result < 0) {
    throw new Error(`${result} < 0: bst(${operand}); ${JSON.stringify(state)}`);
  }

  state.registers[1] = result;
  state.instructionPointer += 2;
  return [];
};

const jnz: Operation = (operand: bigint, state: ProgramState): bigint[] => {
  if (state.registers[0] === BIGINT_ZERO()) {
    // console.log("jnz: NUL");
    state.instructionPointer += 2;
    return [];
  }

  // console.log(`jnz: jmp ${operand}`);
  state.instructionPointer = Number(operand);
  return [];
};

const bxc: Operation = (_operand: bigint, state: ProgramState): bigint[] => {
  const result = state.registers[1] ^ state.registers[2];
  // console.log(`bxc: B = B ^ C`);

  if (result < 0) {
    throw new Error(`${result} < 0: bxc; ${JSON.stringify(state)}`);
  }

  state.registers[1] = result;
  state.instructionPointer += 2;
  return [];
};

const out: Operation = (operand: bigint, state: ProgramState): bigint[] => {
  const comboOp = resolveComboOperand(operand, state);
  // console.log(`out: ${comboOp} % 8`);

  const result = comboOp % BigInt(8);

  if (result < 0) {
    throw new Error(`${result} < 0: adv(${operand}); ${JSON.stringify(state)}`);
  }

  state.instructionPointer += 2;
  return [result];
};

const bdv: Operation = (operand: bigint, state: ProgramState): bigint[] => {
  const comboOp = resolveComboOperand(operand, state);
  // console.log(`bdv: B = A / 2**${comboOp}`);

  const result = state.registers[0] / BigInt(2) ** comboOp;

  if (result < 0) {
    throw new Error(`${result} < 0: adv(${operand}); ${JSON.stringify(state)}`);
  }

  state.registers[1] = result;
  state.instructionPointer += 2;
  return [];
};

const cdv: Operation = (operand: bigint, state: ProgramState): bigint[] => {
  const comboOp = resolveComboOperand(operand, state);
  // console.log(`cdv: C = A / 2**${comboOp}`);

  const result = state.registers[0] / BigInt(2) ** comboOp;

  if (result < 0) {
    throw new Error(`${result} < 0: adv(${operand}); ${JSON.stringify(state)}`);
  }

  state.registers[2] = result;
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

const resolveComboOperand = (operand: bigint, state: ProgramState): bigint => {
  if (operand <= 3) {
    return operand;
  } else if (operand === BigInt(7)) {
    throw new Error(`Invalid operand ${operand}`);
  }
  const idx = operand - BigInt(4);
  return state.registers[Number(idx)];
};

const parseProgram = (input: string): ProgramState => {
  const [registerStr, programStr] = input.split("\n\n");

  const regexA = /A: (\d+)/;
  const regexB = /B: (\d+)/;
  const regexC = /C: (\d+)/;

  const registers: bigint[] = [];

  let matches = regexA.exec(registerStr);
  registers.push(BigInt(matches![1]));

  matches = regexB.exec(registerStr);
  registers.push(BigInt(matches![1]));

  matches = regexC.exec(registerStr);
  registers.push(BigInt(matches![1]));

  const programMatch = /: (.*)/.exec(programStr);
  const program = programMatch![1].split(",").map(Number);

  return { instructionPointer: 0, registers, program };
};

/**
 * Given a program, removes the last 4 ops:
 * - A = A / 8
 * - jnx 0
 *
 * And returns the single output value
 */
const executeTrimmed = (
  registerA: bigint,
  trimmedProgram: number[]
): bigint => {
  const modifiedState: ProgramState = {
    instructionPointer: 0,
    program: trimmedProgram,
    registers: [registerA, BIGINT_ZERO(), BIGINT_ZERO()],
  };
  return execute(modifiedState)[0];
};

const execute = (state: ProgramState): bigint[] => {
  const output: bigint[] = [];
  while (state.instructionPointer < state.program.length) {
    const opcode = state.program[state.instructionPointer];
    const operand = state.program[state.instructionPointer + 1];
    const stepOutput = operations[opcode](BigInt(operand), state);
    output.push(...stepOutput);
  }
  return output;
};

const solve = (input: string): string => {
  const state = parseProgram(input);
  const output = execute(state);
  return output.join(",");
};

// Adapted from https://www.reddit.com/r/adventofcode/comments/1hg38ah/comment/m2hmgw5
const find = (
  A: bigint,
  col: number,
  originalProgram: number[],
  As: bigint[]
): void => {
  const offsetIdx = originalProgram.length - 1 - col;
  const testResult = executeTrimmed(A, originalProgram);
  if (Number(testResult) !== originalProgram[offsetIdx]) {
    return;
  }

  if (col == originalProgram.length - 1) {
    As.push(A);
  } else {
    for (let j = BIGINT_ZERO(); j < 8; j++) {
      find(A * BigInt(8) + j, col + 1, originalProgram, As);
    }
  }
};

const solveUsingFind = (input: string): bigint => {
  const originalState = parseProgram(input);
  const originalProgram = [...originalState.program];

  const As: bigint[] = [];
  for (let i = BIGINT_ZERO(); i < 8; i++) {
    find(i, 0, originalProgram, As);
  }

  return As[0];
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input)).toEqual("4,6,3,5,6,3,5,2,1,0");
  });

  // Program: 2,4, 1,1, 7,5, 1,5, 4,2, 5,5, 0,3, 3,0
  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input)).toEqual("3,6,7,0,5,7,3,1,4");
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo-2.txt"));
    expect(solveUsingFind(input)).toEqual(BigInt(117440));
  });

  test("part 2 - find", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solveUsingFind(input)).toEqual(BigInt(164278496489149));
  });
});
