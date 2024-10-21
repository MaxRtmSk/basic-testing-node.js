import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const input = [1];
    const expectedOutput = {
      value: 1,
      next: {
        value: null,
        next: null,
      },
    };

    expect(generateLinkedList(input)).toStrictEqual(expectedOutput);
  });

  test('should generate linked list from values 2', () => {
    const input = [1,2];
    const linkedList = generateLinkedList(input);

    expect(linkedList).toMatchSnapshot();
  });
});
