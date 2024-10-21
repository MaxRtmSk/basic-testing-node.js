//https://jestjs.io/docs/timer-mocks
import fs from 'fs';
import { doStuffByTimeout, doStuffByInterval, readFileAsynchronously } from '.';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const spy = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, 1000);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(callback, 1000);

    spy.mockRestore()
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);

    expect(callback).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const spy = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, 1000);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(callback, 1000);

    spy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(3000);

    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const joinSpy = jest.spyOn(require('path'), 'join');

    const pathToFile = './test2.txt';
    await readFileAsynchronously(pathToFile);

    expect(joinSpy).toHaveBeenCalledWith(expect.any(String), pathToFile);

    joinSpy.mockRestore();
  });

  test('should return null if file does not exist', async () => {
    const result = await readFileAsynchronously('./text.txt');
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const content = 'TEXT';
    jest.spyOn(fs.promises, 'readFile').mockResolvedValue(content);
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
  
    const result = await readFileAsynchronously('./text.txt');

    expect(result).toBe(content);
  });
});
