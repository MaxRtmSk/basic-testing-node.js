import { getBankAccount, InsufficientFundsError, SynchronizationFailedError, TransferFailedError } from '.';
import { random } from 'lodash';

jest.mock('lodash', () => ({
  random: jest.fn()
}))

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const balance = 10;
    const bankAccount = getBankAccount(balance);

    expect(bankAccount.getBalance()).toBe(balance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const balance = 10;
    const bankAccount = getBankAccount(balance);

    expect(() => bankAccount.withdraw(11)).toThrow(new InsufficientFundsError(balance));
  });

  test('should throw error when transferring more than balance', () => {
    const bankAccount1 = getBankAccount(10);
    const bankAccount2 = getBankAccount(5);

    expect(() => bankAccount1.transfer(20, bankAccount2)).toThrow(new InsufficientFundsError(10));
  });

  test('should throw error when transferring to the same account', () => {
    const balance = 10;
    const bankAccount = getBankAccount(balance);

    expect(() => bankAccount.transfer(5, bankAccount)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const bankAccount = getBankAccount(0);
    bankAccount.deposit(10)

    expect(bankAccount.getBalance()).toBe(10);
  });

  test('should withdraw money', () => {
    const bankAccount = getBankAccount(10);
    bankAccount.withdraw(5)

    expect(bankAccount.getBalance()).toBe(5);
  });

  test('should transfer money', () => {
    const bankAccount1 = getBankAccount(10);
    const bankAccount2 = getBankAccount(3);

    bankAccount1.transfer(5, bankAccount2);

    expect(bankAccount1.getBalance()).toBe(5);
    expect(bankAccount2.getBalance()).toBe(8);
  });

  test('fetchBalance should return number if request is successful', async () => {
    const bankAccount = getBankAccount(10);

    (random as jest.Mock).mockReturnValueOnce(50);
    (random as jest.Mock).mockReturnValueOnce(1); 

    const balance = await bankAccount.fetchBalance();
    expect(typeof balance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const bankAccount = getBankAccount(10);

    const newBalance = 30;

    (random as jest.Mock).mockReturnValueOnce(newBalance);
    (random as jest.Mock).mockReturnValueOnce(1); 

    await bankAccount.synchronizeBalance();

    expect(bankAccount.getBalance()).toBe(newBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const bankAccount = getBankAccount(10);

    const newBalance = 30;

    (random as jest.Mock).mockReturnValueOnce(newBalance);
    (random as jest.Mock).mockReturnValueOnce(0); 

    await expect(bankAccount.synchronizeBalance()).rejects.toThrow(SynchronizationFailedError)
  });
});
