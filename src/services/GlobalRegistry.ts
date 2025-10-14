import type Bank from '@/models/bank';
import type User from '@/models/user';
import type BankAccount from '@/models/bank-account';

const banks: Map<string, Bank> = new Map();
const users: Map<string, User> = new Map();
const accounts: Map<string, BankAccount> = new Map();

export default class GlobalRegistry {
  static registerBank(bank: Bank) {
    banks.set(bank.getId(), bank);
  }

  static getBank(id: string): Bank | undefined {
    return banks.get(id);
  }

  static registerUser(user: User) {
    users.set(user.getId(), user);
  }

  static getUser(id: string): User | undefined {
    return users.get(id);
  }

  static registerAccount(account: BankAccount) {
    accounts.set(account.getId(), account);
  }

  static getAccount(id: string): BankAccount | undefined {
    return accounts.get(id);
  }

  static clear() {
    banks.clear();
    users.clear();
    accounts.clear();
  }
}
