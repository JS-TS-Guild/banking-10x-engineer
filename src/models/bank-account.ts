import { genId } from '@/utils/id';

export default class BankAccount {
  private id: string;
  private balance: number;
  private bankId: string;
  private ownerId: string | null = null;
  private allowsNegative: boolean;

  constructor(bankId: string, initialBalance = 0, allowsNegative = false) {
    this.id = genId('acct');
    this.bankId = bankId;
    this.balance = initialBalance;
    this.allowsNegative = allowsNegative;
  }

  static create(bankId: string, initialBalance = 0, allowsNegative = false) {
    return new BankAccount(bankId, initialBalance, allowsNegative);
  }

  getId(): string {
    return this.id;
  }

  getBalance(): number {
    return this.balance;
  }

  getBankId(): string {
    return this.bankId;
  }

  getOwnerId(): string | null {
    return this.ownerId;
  }

  setOwner(userId: string) {
    this.ownerId = userId;
  }

  deposit(amount: number) {
    if (amount <= 0) throw new Error('Deposit must be positive');
    this.balance += amount;
  }

  canWithdraw(amount: number): boolean {
    if (amount <= 0) return false;
    if (this.allowsNegative) return true;
    return this.balance - amount >= 0;
  }

  withdraw(amount: number) {
    if (amount <= 0) throw new Error('Withdraw must be positive');
    if (!this.canWithdraw(amount)) throw new Error('Insufficient funds');
    this.balance -= amount;
  }

  forceWithdraw(amount: number) {
    if (amount <= 0) throw new Error('Withdraw must be positive');
    this.balance -= amount;
  }
}
