import { simpleCalculator, Action } from './index';

const testCases = [
    { a: 1, b: 2, action: Action.Add, expected: 3 },
    { a: 1, b: -1, action: Action.Subtract, expected: 2 },
    { a: 2, b: 2, action: Action.Multiply, expected: 4 },
    { a: 4, b: 2, action: Action.Divide, expected: 2 },
    { a: 4, b: 2, action: Action.Exponentiate, expected: 16 },
    { a: 1, b: 2, action: 'Add', expected: null },
    { a: '1', b: 2, action: Action.Add, expected: null }, 
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'calculates $action of $a and $b to be $expected',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toEqual(expected);
    }
  );
});
